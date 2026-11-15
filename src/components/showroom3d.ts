/*
 * The real-time 3D viewer behind the Showroom. This file pulls in three.js,
 * so the Showroom loads it only when the section is about to come on screen.
 *
 * It draws one game model at a time on a transparent canvas: the game's own
 * shape and textures, lit like a product shot. The model turns slowly by
 * itself, follows a drag with a little momentum, and settles into place when
 * a new one is chosen.
 */
import {
  ACESFilmicToneMapping,
  Box3,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PMREMGenerator,
  PerspectiveCamera,
  SRGBColorSpace,
  Scene,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import type { Material, Object3D, Texture } from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

/**
 * How the model is drawn:
 *   wire   its triangles only, as a modeller first sees it
 *   clay   one plain grey surface, before any texture
 *   final  the finished asset with its textures, as it is in the game
 */
export type Look = 'wire' | 'clay' | 'final'

export type Viewer = {
  /** Shows a model, loading it first if needed. Resolves when it is on screen. */
  show: (id: string) => Promise<void>
  /** Fetches a model ahead of time so choosing it is instant. */
  preload: (id: string) => void
  /** Turns the model by hand, in radians. Used for the arrow keys. */
  nudge: (yaw: number) => void
  /** Changes how the model is drawn. */
  setLook: (look: Look) => void
  dispose: () => void
}

type Options = {
  canvas: HTMLCanvasElement
  /** Where the models live, e.g. '/models/gun-'. */
  base: string
  /** False when reduced motion is requested: the model stays still unless dragged. */
  animate: boolean
}

const REST_PITCH = 0.18
const AUTO_SPEED = 0.45

export function createViewer({ canvas, base, animate }: Options): Viewer {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15

  const scene = new Scene()
  const camera = new PerspectiveCamera(30, 1, 0.1, 50)
  camera.position.set(0, 0.15, 4.6)
  camera.lookAt(0, 0, 0)

  /* A neutral room for the metal to reflect, then three lights: key, a warm rim and a cool fill. */
  const pmrem = new PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  scene.environment = pmrem.fromScene(room, 0.04).texture
  scene.environmentIntensity = 0.9
  const key = new DirectionalLight(0xffffff, 2.4)
  key.position.set(2.5, 3.5, 4)
  const rim = new DirectionalLight(new Color('#ff8a4c'), 3.2)
  rim.position.set(-4, 1.5, -3)
  const fill = new DirectionalLight(new Color('#6aa5ff'), 1.4)
  fill.position.set(4, -1, -2)
  scene.add(key, rim, fill, new HemisphereLight(0xffffff, 0x1b2430, 0.35))

  const turntable = new Group()
  scene.add(turntable)

  const gltf = new GLTFLoader()
  const textures = new TextureLoader()
  const cache = new Map<string, Promise<Object3D>>()
  /* Each model's finished material, kept so the look can change and change back. */
  const finished = new Map<Object3D, Material>()
  const wire = new MeshBasicMaterial({ color: new Color('#8fc1ff'), wireframe: true, transparent: true, opacity: 0.85 })
  const clay = new MeshStandardMaterial({ color: new Color('#7d848e'), roughness: 0.9, metalness: 0, envMapIntensity: 0.5 })
  let look: Look = 'final'

  function dress(model: Object3D) {
    const material = look === 'wire' ? wire : look === 'clay' ? clay : finished.get(model)
    if (!material) return
    model.traverse((child) => {
      if (child instanceof Mesh) child.material = material
    })
  }

  const texture = (url: string, colour = false) =>
    new Promise<Texture>((resolve, reject) => {
      textures.load(
        url,
        (loaded) => {
          loaded.flipY = false
          if (colour) loaded.colorSpace = SRGBColorSpace
          loaded.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
          resolve(loaded)
        },
        undefined,
        reject,
      )
    })

  function load(id: string): Promise<Object3D> {
    const cached = cache.get(id)
    if (cached) return cached
    const loading = Promise.all([
      gltf.loadAsync(`${base}${id}.glb`),
      texture(`${base}${id}-albedo.webp`, true),
      texture(`${base}${id}-normal.webp`),
      texture(`${base}${id}-orm.webp`),
    ]).then(([file, albedo, normal, orm]) => {
      const material = new MeshStandardMaterial({
        map: albedo,
        normalMap: normal,
        normalScale: new Vector2(1.4, 1.4),
        aoMap: orm,
        roughnessMap: orm,
        metalnessMap: orm,
        roughness: 1,
        metalness: 1,
      })
      const model = file.scene
      /* Centre the model and scale it to fill the view, whatever size it was made at. */
      const box = new Box3().setFromObject(model)
      const size = box.getSize(new Vector3())
      const centre = box.getCenter(new Vector3())
      const holder = new Group()
      model.position.sub(centre)
      holder.add(model)
      holder.scale.setScalar(2.3 / Math.max(size.x, size.y, size.z))
      finished.set(holder, material)
      dress(holder)
      return holder
    })
    cache.set(id, loading)
    loading.catch(() => cache.delete(id))
    return loading
  }

  /* Turning: a slow spin, plus whatever the hand adds, easing back when let go. */
  let yaw = -0.6
  let pitch = REST_PITCH
  let spin = 0
  let dragging = false
  let lastX = 0
  let lastY = 0
  let arrival = 1
  let current: Object3D | null = null

  const onDown = (event: PointerEvent) => {
    dragging = true
    lastX = event.clientX
    lastY = event.clientY
    canvas.setPointerCapture(event.pointerId)
  }
  const onMove = (event: PointerEvent) => {
    if (!dragging) return
    const dx = event.clientX - lastX
    const dy = event.clientY - lastY
    lastX = event.clientX
    lastY = event.clientY
    yaw += dx * 0.01
    spin = dx * 0.6
    pitch = Math.max(-0.7, Math.min(0.9, pitch + dy * 0.006))
  }
  const onUp = () => {
    dragging = false
  }
  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointerup', onUp)
  canvas.addEventListener('pointercancel', onUp)

  function resize() {
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    if (width === 0 || height === 0) return
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    /* Pull back on narrow stages so a wide model still fits. */
    camera.position.z = camera.aspect < 1 ? 4.6 / Math.max(0.62, camera.aspect) : 4.6
    camera.updateProjectionMatrix()
  }
  const resizer = new ResizeObserver(resize)
  resizer.observe(canvas)
  resize()

  let frame = 0
  let visible = true
  let last = performance.now()
  const tick = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    if (!dragging) {
      yaw += spin * dt + (animate ? AUTO_SPEED * dt : 0)
      spin *= Math.pow(0.04, dt)
      pitch += (REST_PITCH - pitch) * Math.min(1, dt * 1.6)
    }
    /* A new model swings in: it grows from small while a last turn runs out. */
    arrival += (1 - arrival) * Math.min(1, dt * (animate ? 5 : 60))
    const scale = 0.55 + 0.45 * arrival
    turntable.rotation.set(pitch, yaw + (1 - arrival) * -2.2, 0)
    turntable.scale.setScalar(scale)
    if (animate) turntable.position.y = Math.sin(now / 900) * 0.045
    renderer.render(scene, camera)
    if (visible) frame = requestAnimationFrame(tick)
  }
  const watcher = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    cancelAnimationFrame(frame)
    if (visible) {
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }
  })
  watcher.observe(canvas)

  let wanted = ''
  return {
    async show(id) {
      wanted = id
      const model = await load(id)
      if (wanted !== id) return
      if (current) turntable.remove(current)
      current = model
      dress(model)
      turntable.add(model)
      arrival = 0
    },
    preload(id) {
      void load(id).catch(() => undefined)
    },
    nudge(amount) {
      yaw += amount
    },
    setLook(next) {
      look = next
      if (current) dress(current)
      /* A short extra turn marks the change. */
      spin = animate ? 2.2 : 0
    },
    dispose() {
      visible = false
      cancelAnimationFrame(frame)
      watcher.disconnect()
      resizer.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      wire.dispose()
      clay.dispose()
      pmrem.dispose()
      room.dispose()
      renderer.dispose()
    },
  }
}
