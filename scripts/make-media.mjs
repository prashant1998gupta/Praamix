/*
 * Prepares the site's pictures.
 *
 *   npm run media
 *
 * Reads the originals in media-source/ and the list in scripts/media.config.mjs.
 * For each picture it writes AVIF and WebP copies at several widths, plus one
 * JPEG for older browsers, into public/media/. It also writes the logo, the
 * browser tab icons, and src/content/media.generated.ts, which tells the site
 * which files exist.
 */
import { mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { IMAGES, LOGO } from './media.config.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const sourceDir = join(root, 'media-source')
const publicDir = join(root, 'public')
const outDir = join(publicDir, 'media')

/* The JPEG for older browsers is saved at the largest listed width up to this. */
const FALLBACK_MAX = 1080
const WHITE = '#ffffff'

await rm(outDir, { recursive: true, force: true })
await mkdir(outDir, { recursive: true })

const entries = {}

for (const image of IMAGES) {
  const input = join(sourceDir, image.source)
  const meta = await sharp(input).metadata()
  const area = image.crop ?? { left: 0, top: 0, width: meta.width, height: meta.height }
  const widths = image.widths.filter((width) => width <= area.width)
  if (widths.length === 0) throw new Error(`${image.source} is too small for the widths listed for ${image.name}`)

  const sized = (width) => sharp(input).extract(area).resize({ width })
  const file = (width, format) => join(outDir, `${image.name}-${width}.${format}`)

  for (const width of widths) {
    await sized(width).avif({ quality: 55, effort: 6 }).toFile(file(width, 'avif'))
    await sized(width).webp({ quality: 80, effort: 5 }).toFile(file(width, 'webp'))
  }
  const fallback = widths.filter((width) => width <= FALLBACK_MAX).at(-1) ?? widths[0]
  await sized(fallback).jpeg({ quality: 80, mozjpeg: true }).toFile(file(fallback, 'jpg'))

  const largest = widths.at(-1)
  entries[image.name] = {
    base: `/media/${image.name}`,
    widths,
    width: largest,
    height: Math.round((largest * area.height) / area.width),
    fallback,
  }
}

/* The logo: the empty margin around the artwork is trimmed off. The artwork itself is not altered. */
const logoInput = join(sourceDir, LOGO.source)
const logo = await sharp(logoInput).trim().png().toBuffer({ resolveWithObject: true })
const logoFallback = LOGO.widths[Math.floor(LOGO.widths.length / 2)]
for (const width of LOGO.widths) {
  await sharp(logo.data)
    .resize({ width })
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(join(outDir, `${LOGO.name}-${width}.webp`))
}
await sharp(logo.data)
  .resize({ width: logoFallback })
  .png({ compressionLevel: 9 })
  .toFile(join(outDir, `${LOGO.name}-${logoFallback}.png`))

const logoLargest = LOGO.widths.at(-1)
entries[LOGO.name] = {
  base: `/media/${LOGO.name}`,
  widths: LOGO.widths,
  width: logoLargest,
  height: Math.round((logoLargest * logo.info.height) / logo.info.width),
  fallback: logoFallback,
}

/* Browser tab and home-screen icons: the P mark from the logo on a white tile. */
const mark = await sharp(logoInput).extract(LOGO.mark).png().toBuffer()
const tile = (size, inner) => {
  const pad = Math.round((size - inner) / 2)
  return sharp(mark)
    .resize({ width: inner, height: inner, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .extend({ top: pad, bottom: size - inner - pad, left: pad, right: size - inner - pad, background: WHITE })
    .flatten({ background: WHITE })
    .png({ compressionLevel: 9 })
}
await tile(64, 48).toFile(join(publicDir, 'favicon.png'))
await tile(180, 124).toFile(join(publicDir, 'apple-touch-icon.png'))

const generated = `/* Written by \`npm run media\`. Do not edit by hand: change scripts/media.config.mjs and run it again. */
import type { ImageFile } from './types.ts'

export const media = ${JSON.stringify(entries, null, 2)} satisfies Record<string, ImageFile>
`
await writeFile(join(root, 'src', 'content', 'media.generated.ts'), generated)

let total = 0
const files = await readdir(outDir)
for (const name of files) total += (await stat(join(outDir, name))).size

console.log(`media: ${IMAGES.length} pictures and the logo, ${files.length} files, ${Math.round(total / 1024)} KB in public/media/`)
for (const [name, entry] of Object.entries(entries)) {
  console.log(`  ${name.padEnd(20)} ${entry.width}x${entry.height}  widths ${entry.widths.join(', ')}`)
}
