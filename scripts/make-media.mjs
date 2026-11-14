/*
 * Prepares one image for the site.
 *
 *   npm run media -- <image file> <name> [--game sheriff-town-vr] [--no-portrait]
 *
 * Example:
 *   npm run media -- "C:\Captures\town-square.png" hero
 *
 * It writes WebP copies at several widths into public/media/<game>/, plus a
 * 4:5 crop for phones, then prints the entry to paste into
 * src/content/site.ts. Phones then download a small file instead of the
 * full-size capture.
 */
import { mkdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

export const LANDSCAPE_WIDTHS = [480, 800, 1200, 1600, 2400]
export const PORTRAIT_WIDTHS = [480, 800, 1200]
const PORTRAIT_ASPECT = 4 / 5

/**
 * Writes `<name>-<width>.webp` for each width the source is large enough for.
 * With `aspect`, it crops to that shape first, keeping the busiest part of the picture.
 */
export async function writeVariants({ input, outDir, name, widths, aspect }) {
  const meta = await sharp(input).metadata()
  let cropWidth = meta.autoOrient?.width ?? meta.width
  let cropHeight = meta.autoOrient?.height ?? meta.height

  if (aspect) {
    if (cropWidth / cropHeight > aspect) cropWidth = Math.round(cropHeight * aspect)
    else cropHeight = Math.round(cropWidth / aspect)
  }

  /* The standard widths the source is large enough for, plus its full width where that adds detail. */
  const usable = widths.filter((width) => width <= cropWidth)
  const full = Math.min(cropWidth, widths.at(-1))
  if (usable.length === 0 || full > usable.at(-1) * 1.12) usable.push(full)

  await mkdir(outDir, { recursive: true })
  for (const width of usable) {
    const height = Math.round((width * cropHeight) / cropWidth)
    await sharp(input)
      .rotate()
      .resize({ width, height, fit: 'cover', position: sharp.strategy.attention })
      .webp({ quality: 78 })
      .toFile(join(outDir, `${name}-${width}.webp`))
  }

  const largest = usable.at(-1)
  return {
    name,
    widths: usable,
    width: largest,
    height: Math.round((largest * cropHeight) / cropWidth),
  }
}

function usage(message) {
  if (message) console.error(`\n${message}`)
  console.error(
    '\nUsage: npm run media -- <image file> <name> [--game sheriff-town-vr] [--no-portrait]\n' +
      'Example: npm run media -- "C:\\Captures\\town-square.png" hero\n',
  )
  process.exit(1)
}

async function main() {
  const args = process.argv.slice(2)
  const gameFlag = args.indexOf('--game')
  const game = gameFlag >= 0 ? args[gameFlag + 1] : 'sheriff-town-vr'
  const withPortrait = !args.includes('--no-portrait')
  const [file, name] = args.filter(
    (arg, index) => !arg.startsWith('--') && (gameFlag < 0 || index !== gameFlag + 1),
  )

  if (!file || !name) usage()
  if (!/^[a-z0-9-]+$/.test(name)) usage(`"${name}" should use lower-case letters, numbers and dashes only.`)
  if (!game || !/^[a-z0-9-]+$/.test(game)) usage('--game needs a folder name such as sheriff-town-vr.')

  const input = resolve(file)
  const outDir = fileURLToPath(new URL(`../public/media/${game}/`, import.meta.url))
  const folder = `/media/${game}`
  const entry = (crop) =>
    `{ base: '${folder}/${crop.name}', widths: [${crop.widths.join(', ')}], width: ${crop.width}, height: ${crop.height} }`

  const landscape = await writeVariants({ input, outDir, name, widths: LANDSCAPE_WIDTHS })
  const lines = [`      landscape: ${entry(landscape)},`]
  let count = landscape.widths.length

  if (withPortrait) {
    const portrait = await writeVariants({
      input,
      outDir,
      name: `${name}-portrait`,
      widths: PORTRAIT_WIDTHS,
      aspect: PORTRAIT_ASPECT,
    })
    lines.push(`      portrait: ${entry(portrait)},`)
    count += portrait.widths.length
  }

  console.log(`
Wrote ${count} files to public/media/${game}/

Paste this into src/content/site.ts in place of \`image: null\`,
then replace the alt text with a description of the picture:

    image: {
      alt: 'Describe what this picture shows',
${lines.join('\n')}
    },
`)
  if (landscape.width < 1600) {
    console.log(`Note: the source is only ${landscape.width}px wide, so it will look soft on large screens.\n`)
  }
}

/* Run main() only when this file is the command, not when the checks import it. */
const thisFile = fileURLToPath(import.meta.url).toLowerCase()
if (process.argv[1] && resolve(process.argv[1]).toLowerCase() === thisFile) {
  main().catch((error) => usage(error.message))
}
