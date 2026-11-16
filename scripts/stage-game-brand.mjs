/*
 * Prepares the Sheriff Town VR logo and key art for the site.
 *
 *   node scripts/stage-game-brand.mjs <posters folder> <logo kit folder>
 *
 * The posters folder holds the twelve key-art posters (NN_Name_Place_Poster.png).
 * The logo kit folder holds sheriff-town-logo.png and sheriff-town-logo-reveal.webm.
 *
 * It writes into media-source/game/:
 *   posters/<name>.jpg              each poster as a high-quality JPEG, a tenth of the PNG's size
 *   sheriff-town-logo.png           the logo, unchanged
 *   sheriff-town-drum.png           the revolver drum cut out of the logo, so the site can spin it
 *   sheriff-town-logo-reveal.webm   the reveal animation, made smaller (needs ffmpeg; copied as it is without)
 *
 * Nothing is redrawn. Run `npm run media` afterwards.
 */
import { spawnSync } from 'node:child_process'
import { copyFile, mkdir, readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const [postersDir, kitDir] = process.argv.slice(2)
if (!postersDir || !kitDir) {
  console.error('Usage: node scripts/stage-game-brand.mjs <posters folder> <logo kit folder>')
  process.exit(1)
}

const root = fileURLToPath(new URL('../', import.meta.url))
const out = join(root, 'media-source', 'game')
await mkdir(join(out, 'posters'), { recursive: true })

const kb = async (file) => `${Math.round((await stat(file)).size / 1024)} KB`

/* ---------- Posters ---------- */

/* "04_GiantAnimals_Street_Poster.png" becomes "giant-animals". */
const slug = (file) =>
  file
    .replace(/^\d+_/, '')
    .split('_')[0]
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()

const posters = (await readdir(postersDir)).filter((file) => /^\d+_.+_Poster\.png$/i.test(file)).sort()
for (const file of posters) {
  const target = join(out, 'posters', `${slug(file)}.jpg`)
  await sharp(join(postersDir, file))
    .flatten({ background: '#000000' })
    .jpeg({ quality: 93, chromaSubsampling: '4:4:4', mozjpeg: true })
    .toFile(target)
  console.log(`poster  ${slug(file).padEnd(14)} ${await kb(target)}`)
}

/* ---------- The logo, and its drum ---------- */

const logo = join(out, 'sheriff-town-logo.png')
await copyFile(join(kitDir, 'sheriff-town-logo.png'), logo)
console.log(`logo    ${await kb(logo)}`)

/*
 * Where the revolver drum sits in the 1200 by 900 logo, measured from the
 * artwork: its centre, and a radius that ends inside the dark outline around
 * it. The site lays the cut-out back over the logo at exactly this place
 * (see DRUM in src/components/GameLogo.tsx) and turns it.
 */
const DRUM = { x: 435, y: 536, radius: 137 }
const size = DRUM.radius * 2
const mask = Buffer.from(
  `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><circle cx="${DRUM.radius}" cy="${DRUM.radius}" r="${DRUM.radius}" fill="#fff"/></svg>`,
)
const drum = join(out, 'sheriff-town-drum.png')
const square = await sharp(logo)
  .extract({ left: DRUM.x - DRUM.radius, top: DRUM.y - DRUM.radius, width: size, height: size })
  .png()
  .toBuffer()
await sharp(square).composite([{ input: mask, blend: 'dest-in' }]).png({ compressionLevel: 9 }).toFile(drum)
console.log(`drum    ${size}px, ${await kb(drum)}`)

/* ---------- The reveal animation ---------- */

const reveal = join(out, 'sheriff-town-logo-reveal.webm')
const source = join(kitDir, 'sheriff-town-logo-reveal.webm')
/* The decoder is named, because ffmpeg's default one drops the transparency. */
const encoded = spawnSync(
  'ffmpeg',
  ['-y', '-loglevel', 'error', '-c:v', 'libvpx-vp9', '-i', source, '-vf', 'scale=800:600:flags=lanczos', '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '38', '-row-mt', '1', '-an', reveal],
  { stdio: 'inherit' },
)
if (encoded.status !== 0) {
  await copyFile(source, reveal)
  console.log('reveal  ffmpeg was not available, so the animation was copied at its full size')
}
console.log(`reveal  ${await kb(reveal)}`)
