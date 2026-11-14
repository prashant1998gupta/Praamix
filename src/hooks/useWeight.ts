import { useEffect, useRef } from 'react'

/*
 * The signature interaction: featured media behaves like an object with mass.
 *
 * A damped spring drives three values on the [data-weight] element inside the
 * zone this hook is attached to:
 *   --wx, --wy  where the object leans, from -1 to 1 on each axis
 *   --wp        how far it is pressed down, from 0 to 1
 * CSS turns those into a small tilt and shift (see .weighted in media.css).
 *
 * Mouse and pen   lean towards the pointer, then settle when it leaves
 * Touch           press under the finger, settle on release or when scrolling starts
 * Keyboard        one nod when a control inside the zone takes keyboard focus
 * Reduced motion  nothing moves
 *
 * The loop runs only while something is moving. It never touches scrolling.
 */

const STIFFNESS = 95 // pull towards the target
const DAMPING = 12.5 // a little under critical, so it overshoots once and settles
const NOD = 9 // downward kick given on keyboard focus
const AXES = ['x', 'y', 'p'] as const

type Axis = (typeof AXES)[number]
type Vector = Record<Axis, number>

const zero = (): Vector => ({ x: 0, y: 0, p: 0 })
const clamp = (value: number) => Math.max(-1, Math.min(1, value))

export function useWeight<T extends HTMLElement>() {
  const zoneRef = useRef<T>(null)

  useEffect(() => {
    const zone = zoneRef.current
    const body = zone?.querySelector<HTMLElement>('[data-weight]')
    if (!zone || !body) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const position = zero()
    const velocity = zero()
    const target = zero()
    let frame = 0
    let last = 0

    const write = () => {
      body.style.setProperty('--wx', position.x.toFixed(4))
      body.style.setProperty('--wy', position.y.toFixed(4))
      body.style.setProperty('--wp', position.p.toFixed(4))
    }

    const clear = () => {
      body.style.removeProperty('--wx')
      body.style.removeProperty('--wy')
      body.style.removeProperty('--wp')
      delete body.dataset.moving
    }

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30)
      last = now
      let moving = false

      for (const axis of AXES) {
        const pull = STIFFNESS * (target[axis] - position[axis])
        velocity[axis] += (pull - DAMPING * velocity[axis]) * dt
        position[axis] += velocity[axis] * dt
        if (Math.abs(velocity[axis]) > 0.01 || Math.abs(target[axis] - position[axis]) > 0.001) {
          moving = true
        }
      }

      if (moving) {
        write()
        frame = requestAnimationFrame(tick)
        return
      }

      frame = 0
      for (const axis of AXES) {
        position[axis] = target[axis]
        velocity[axis] = 0
      }
      if (AXES.every((axis) => target[axis] === 0)) {
        clear()
      } else {
        write()
        delete body.dataset.moving
      }
    }

    const wake = () => {
      if (reduced.matches || frame) return
      last = performance.now()
      body.dataset.moving = ''
      frame = requestAnimationFrame(tick)
    }

    const aim = (event: PointerEvent) => {
      const rect = body.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      target.x = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1)
      target.y = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1)
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      aim(event)
      wake()
    }

    const onDown = (event: PointerEvent) => {
      aim(event)
      target.p = 1
      wake()
    }

    const onRelease = (event: PointerEvent) => {
      target.p = 0
      if (event.pointerType === 'touch') {
        target.x = 0
        target.y = 0
      }
      wake()
    }

    const onLeave = () => {
      target.x = 0
      target.y = 0
      target.p = 0
      wake()
    }

    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof Element && event.target.matches(':focus-visible')) {
        velocity.p += NOD
        wake()
      }
    }

    const onPreference = () => {
      if (!reduced.matches) return
      cancelAnimationFrame(frame)
      frame = 0
      Object.assign(position, zero())
      Object.assign(velocity, zero())
      Object.assign(target, zero())
      clear()
    }

    zone.addEventListener('pointermove', onMove, { passive: true })
    zone.addEventListener('pointerdown', onDown, { passive: true })
    zone.addEventListener('pointerup', onRelease, { passive: true })
    zone.addEventListener('pointercancel', onRelease, { passive: true })
    zone.addEventListener('pointerleave', onLeave, { passive: true })
    zone.addEventListener('focusin', onFocus)
    reduced.addEventListener('change', onPreference)

    return () => {
      zone.removeEventListener('pointermove', onMove)
      zone.removeEventListener('pointerdown', onDown)
      zone.removeEventListener('pointerup', onRelease)
      zone.removeEventListener('pointercancel', onRelease)
      zone.removeEventListener('pointerleave', onLeave)
      zone.removeEventListener('focusin', onFocus)
      reduced.removeEventListener('change', onPreference)
      cancelAnimationFrame(frame)
      clear()
    }
  }, [])

  return zoneRef
}
