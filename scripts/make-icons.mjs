/*
 * Draws the browser tab and home-screen icons: the two game pieces from the
 * Praamix logo, one white and one orange, on the site's dark colour.
 *
 *   node scripts/make-icons.mjs
 *
 * `npm run media` runs this too. The piece is the same drawing as in
 * src/components/Logo.tsx; if one changes, change the other.
 */
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import sharp from 'sharp'

const NIGHT = '#0f1318'
const WHITE = '#ffffff'
const ORANGE = '#f26b38'

/* One piece, 26 wide and 30 tall. */
const piece = (fill) => `<g fill="${fill}"><circle cx="13" cy="6.6" r="6.6"/><path d="M0.6 30 8.94 11.8h8.12L25.4 30z"/></g>`

/**
 * An icon on a 100 by 100 grid.
 *   height  how tall the pieces stand, out of 100
 *   corner  how round the tile's corners are, out of 100. 0 where the device rounds them itself.
 */
function icon({ height, corner }) {
  const scale = height / 30
  const width = 26 * scale
  const gap = 1.5
  const left = (100 - width * 2 - gap) / 2
  const top = (100 - height) / 2
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="${corner}" fill="${NIGHT}"/>
  <g transform="translate(${left} ${top}) scale(${scale})">${piece(WHITE)}</g>
  <g transform="translate(${left + width + gap} ${top}) scale(${scale})">${piece(ORANGE)}</g>
</svg>`)
}

export async function makeIcons(publicDir) {
  const save = (name, size, shape) =>
    sharp(icon(shape), { density: (72 * size) / 100 * 4 })
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toFile(join(publicDir, name))

  await save('favicon.png', 64, { height: 52, corner: 20 })
  await save('apple-touch-icon.png', 180, { height: 48, corner: 0 })
  /* For installing the site as an app. The "maskable" one leaves room for the device to cut its own shape. */
  await save('icon-192.png', 192, { height: 50, corner: 20 })
  await save('icon-512.png', 512, { height: 50, corner: 20 })
  await save('icon-maskable-512.png', 512, { height: 36, corner: 0 })
}

/* Run by itself: write the icons into public/. */
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const publicDir = join(fileURLToPath(new URL('../', import.meta.url)), 'public')
  await makeIcons(publicDir)
  console.log('icons: favicon, apple-touch-icon and three app icons written to public/')
}
