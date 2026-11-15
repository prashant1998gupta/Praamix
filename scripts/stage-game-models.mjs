/*
 * Prepares the real game models the website shows in 3D.
 *
 *   node scripts/stage-game-models.mjs "D:\...\Sheriff Town VR" ["C:\...\blender.exe"]
 *
 * For each tool gun it writes into public/models/:
 *   gun-<name>.glb          the model's shape, converted from the game's FBX by Blender
 *   gun-<name>-albedo.webp  its colours
 *   gun-<name>-normal.webp  its surface detail
 *   gun-<name>-orm.webp     occlusion, roughness and metal packed into one picture
 *
 * The models are the game's own, unchanged. Anyone who visits the site can
 * download what is published here, so list only models you are happy to share.
 */
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const [gameRoot, blenderPath] = process.argv.slice(2)
if (!gameRoot) {
  console.error('Usage: node scripts/stage-game-models.mjs <Unity project folder> [blender executable]')
  process.exit(1)
}

const BLENDER = blenderPath ?? 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe'
if (!existsSync(BLENDER)) {
  console.error(`Blender was not found at ${BLENDER}. Pass its path as the second argument.`)
  process.exit(1)
}

/* The guns to publish, by the name the game's files use. */
const GUNS = ['Spawn', 'Physics', 'Gravity', 'Portal', 'Ice', 'Bubble', 'Size', 'CopyPaste', 'Food', 'Scanner', 'Joint', 'Harpoon', 'Connection', 'Modification']
const TEXTURE = 1024

const source = join(gameRoot, 'Assets', '_SheriffTown', 'Art', 'Weapons', 'ToolGuns')
const out = fileURLToPath(new URL('../public/models/', import.meta.url))
await mkdir(out, { recursive: true })

/* Shapes: one Blender run converts every FBX. */
const jobs = GUNS.map((name) => ({
  source: join(source, `SM_ToolGun_${name}.fbx`).replace(/\\/g, '/'),
  target: join(out, `gun-${name.toLowerCase()}.glb`).replace(/\\/g, '/'),
}))
const jobFile = join(tmpdir(), 'praamix-model-jobs.json')
await writeFile(jobFile, JSON.stringify(jobs))
const script = fileURLToPath(new URL('./blender-export-models.py', import.meta.url))
const log = execFileSync(BLENDER, ['-b', '--python', script, '--', jobFile], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
const exported = log.split('\n').filter((line) => line.startsWith('EXPORTED'))
if (exported.length !== GUNS.length) {
  console.error(log.slice(-3000))
  throw new Error(`Blender exported ${exported.length} of ${GUNS.length} models.`)
}

/* Textures: smaller, in WebP, with the three grey maps packed into one. */
let bytes = 0
for (const name of GUNS) {
  const texture = (kind) => join(source, `T_ToolGun_${name}_${kind}.png`)
  const target = (kind) => join(out, `gun-${name.toLowerCase()}-${kind}.webp`)
  const size = { width: TEXTURE, height: TEXTURE, kernel: 'lanczos3' }

  await sharp(texture('Albedo')).removeAlpha().resize(size).webp({ quality: 86 }).toFile(target('albedo'))
  await sharp(texture('Normal')).removeAlpha().resize(size).webp({ quality: 90 }).toFile(target('normal'))

  /*
   * The game keeps metal in the red channel and smoothness in alpha. The web
   * standard wants occlusion in red, roughness in green and metal in blue.
   */
  const metalSmooth = sharp(texture('MetallicSmoothness')).resize(size)
  const metal = await metalSmooth.clone().extractChannel(0).raw().toBuffer()
  const smooth = await metalSmooth.clone().ensureAlpha().extractChannel(3).raw().toBuffer()
  const occlusion = await sharp(texture('Occlusion')).resize(size).extractChannel(0).raw().toBuffer()
  const packed = Buffer.alloc(TEXTURE * TEXTURE * 3)
  for (let i = 0; i < TEXTURE * TEXTURE; i += 1) {
    packed[i * 3] = occlusion[i]
    packed[i * 3 + 1] = Math.round(255 - 0.9 * smooth[i]) // the game scales smoothness by 0.9
    packed[i * 3 + 2] = metal[i]
  }
  await sharp(packed, { raw: { width: TEXTURE, height: TEXTURE, channels: 3 } }).webp({ quality: 86 }).toFile(target('orm'))

  for (const file of [join(out, `gun-${name.toLowerCase()}.glb`), target('albedo'), target('normal'), target('orm')]) {
    bytes += (await stat(file)).size
  }
}

console.log(`stage-game-models: ${GUNS.length} models in public/models/, ${Math.round(bytes / 1024)} KB in all`)
for (const line of exported) console.log(`  ${line.replace(/^EXPORTED .*\/(gun-[a-z]+\.glb)/, '$1')}`)
