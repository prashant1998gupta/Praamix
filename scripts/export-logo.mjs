/*
 * Writes the Praamix logo as files for use outside the website: business
 * cards, video channels, chat servers, documents.
 *
 *   node scripts/export-logo.mjs
 *
 * Everything goes into brand/. The SVG files are pure shapes with no fonts
 * inside, so they open the same in any design or print program. The PNG files
 * are drawn from those SVGs.
 *
 * The logo is laid out exactly as the website draws it (src/styles/logo.css):
 * the letters PR and MIX in Manrope at weight 800, with the two A's replaced
 * by game pieces. The letters' outlines are kept in logo-letters.json, taken
 * once from the site's own font file. If the typeface, its weight or the
 * piece ever changes on the site, this file must be brought back in step.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = fileURLToPath(new URL('../', import.meta.url))
const out = join(root, 'brand')
const letters = JSON.parse(await readFile(new URL('./logo-letters.json', import.meta.url), 'utf8'))

const WHITE = '#ffffff'
const INK = '#191c20'
const ORANGE = '#f26b38'
const NIGHT = '#0f1318'

/* ---------- Layout, in the font's own units (2000 to the em) ---------- */

const EM = letters.unitsPerEm
const SPACING = 0.01 * EM /* letter-spacing, added after every letter */
const PIECE_HEIGHT = 0.76 * EM
const PIECE_WIDTH = (PIECE_HEIGHT * 26) / 30
const PIECE_MARGIN = 0.03 * EM
/* One font unit becomes a tenth of an SVG unit, which keeps the numbers short. */
const K = 0.1

/* The piece on its 26 by 30 grid, as in src/components/Logo.tsx. */
const HEAD = { cx: 13, cy: 6.6, r: 6.6 }
const BODY = [
  [0.6, 30],
  [8.94, 11.8],
  [17.06, 11.8],
  [25.4, 30],
]

const round = (value) => Number(value.toFixed(2))

/* A letter's outline, moved to its place and turned the right way up (fonts measure upwards, SVG downwards). */
function place(d, dx, left, top) {
  return d.replace(/(-?\d*\.?\d+(?:e-?\d+)?)[ ,]+(-?\d*\.?\d+(?:e-?\d+)?)/g, (_pair, x, y) => `${round((Number(x) + dx - left) * K)} ${round((top - Number(y)) * K)}`)
}

function pieceShapes(x, left, top, fill) {
  const scale = PIECE_HEIGHT / 30
  const px = (value) => round((x + value * scale - left) * K)
  const py = (value) => round((top - PIECE_HEIGHT + value * scale) * K)
  const body = BODY.map(([bx, by], index) => `${index === 0 ? 'M' : 'L'}${px(bx)} ${py(by)}`).join('') + 'Z'
  return `<circle cx="${px(HEAD.cx)}" cy="${py(HEAD.cy)}" r="${round(HEAD.r * scale * K)}" fill="${fill}"/><path d="${body}" fill="${fill}"/>`
}

/** The whole logo: where every letter and piece sits, and the box around the ink. */
function layout() {
  const parts = []
  let x = 0
  const run = (text) => {
    for (const glyph of letters.runs[text]) {
      parts.push({ kind: 'letter', d: glyph.d, x, minX: x + glyph.bbox.minX, maxX: x + glyph.bbox.maxX })
      x += glyph.advance + SPACING
    }
  }
  const piece = (index) => {
    x += PIECE_MARGIN
    parts.push({ kind: 'piece', index, x, minX: x, maxX: x + PIECE_WIDTH })
    x += PIECE_WIDTH + PIECE_MARGIN
  }
  run('PR')
  piece(0)
  piece(1)
  run('MIX')
  const left = Math.min(...parts.map((part) => part.minX))
  const right = Math.max(...parts.map((part) => part.maxX))
  return { parts, left, top: PIECE_HEIGHT, width: (right - left) * K, height: PIECE_HEIGHT * K }
}

/** The logo's shapes. `ink` is the colour of the letters and the first piece. */
function logoShapes(ink) {
  const { parts, left, top, width, height } = layout()
  const shapes = parts
    .map((part) => (part.kind === 'letter' ? `<path d="${place(part.d, part.x, left, top)}" fill="${ink}"/>` : pieceShapes(part.x, left, top, part.index === 0 ? ink : ORANGE)))
    .join('\n  ')
  return { shapes, width: round(width), height: round(height) }
}

/** The two pieces alone. */
function piecesShapes(ink) {
  const gap = PIECE_MARGIN * 2
  const shapes = [pieceShapes(0, 0, PIECE_HEIGHT, ink), pieceShapes(PIECE_WIDTH + gap, 0, PIECE_HEIGHT, ORANGE)].join('\n  ')
  return { shapes, width: round((PIECE_WIDTH * 2 + gap) * K), height: round(PIECE_HEIGHT * K) }
}

/**
 * An SVG file. With `canvas`, the artwork is centred on a filled rectangle of
 * that size; without it, the file is cropped to the artwork.
 */
function svg(art, title, canvas) {
  if (!canvas) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${art.width} ${art.height}" width="${art.width}" height="${art.height}" role="img" aria-label="${title}">
  <title>${title}</title>
  ${art.shapes}
</svg>
`
  }
  const scale = (canvas.width * canvas.share) / art.width
  const x = round((canvas.width - art.width * scale) / 2)
  const y = round((canvas.height - art.height * scale) / 2)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas.width} ${canvas.height}" width="${canvas.width}" height="${canvas.height}" role="img" aria-label="${title}">
  <title>${title}</title>
  <rect width="${canvas.width}" height="${canvas.height}" rx="${canvas.corner ?? 0}" fill="${canvas.fill}"/>
  <g transform="translate(${x} ${y}) scale(${round(scale)})">
  ${art.shapes}
  </g>
</svg>
`
}

await rm(out, { recursive: true, force: true })
await mkdir(out, { recursive: true })

const written = []
async function save(name, source, pngWidth) {
  await writeFile(join(out, `${name}.svg`), source)
  await sharp(Buffer.from(source), { density: 600 }).resize({ width: pngWidth }).png({ compressionLevel: 9 }).toFile(join(out, `${name}.png`))
  written.push(name)
}

const NAME = 'Praamix'
const onDark = logoShapes(WHITE)
const onLight = logoShapes(INK)
const banner = { width: 1200, height: 480, share: 0.72 }
const square = { width: 1000, height: 1000, share: 0.6 }

/* The logo with a see-through background, for placing on your own colour. */
await save('praamix-logo-for-dark-backgrounds', svg(onDark, NAME), 2400)
await save('praamix-logo-for-light-backgrounds', svg(onLight, NAME), 2400)

/* The logo on a filled background, ready to use as it is. */
await save('praamix-logo-on-dark', svg(onDark, NAME, { ...banner, fill: NIGHT }), 2400)
await save('praamix-logo-on-white', svg(onLight, NAME, { ...banner, fill: WHITE }), 2400)

/* The two pieces alone, for small places where the name will not fit. */
await save('praamix-pieces-for-dark-backgrounds', svg(piecesShapes(WHITE), NAME), 1024)
await save('praamix-pieces-for-light-backgrounds', svg(piecesShapes(INK), NAME), 1024)

/* A profile picture: square for services that crop it themselves, rounded for anywhere else. */
await save('praamix-profile-picture-square', svg(piecesShapes(WHITE), NAME, { ...square, fill: NIGHT }), 1024)
await save('praamix-profile-picture-rounded', svg(piecesShapes(WHITE), NAME, { ...square, fill: NIGHT, corner: 200 }), 1024)

console.log(`logo: ${written.length} designs written to brand/, each as .svg and .png`)
for (const name of written) console.log(`  ${name}`)
