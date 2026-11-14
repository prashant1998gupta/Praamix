import { cp } from 'node:fs/promises'
import { join } from 'node:path'
import { build } from 'vite'
import { LANDSCAPE_WIDTHS, PORTRAIT_WIDTHS, writeVariants } from '../make-media.mjs'
import { root } from './browser.mjs'

const FOLDER = '/media/__fixture__'

/*
 * A drawn test card. It exists only inside .checks/ so that image loading can
 * be measured before real captures exist. It is not game media and never ships.
 */
function testCard(width, height, hue) {
  const lines = []
  for (let i = 0; i <= 16; i += 1) lines.push(`<path d="M${(width * i) / 16} 0V${height}"/>`)
  for (let i = 0; i <= 9; i += 1) lines.push(`<path d="M0 ${(height * i) / 9}H${width}"/>`)

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
      `<rect width="100%" height="100%" fill="hsl(${hue} 20% 64%)"/>` +
      `<g stroke="#22221f" stroke-width="3" fill="none">${lines.join('')}` +
      `<path d="M0 0L${width} ${height}M${width} 0L0 ${height}"/>` +
      `<circle cx="${width / 2}" cy="${height / 2}" r="${height / 3}"/></g>` +
      `<circle cx="${width / 2}" cy="${height / 2}" r="${height / 14}" fill="#d64328"/></svg>`,
  )
}

const toCrop = (crop) => ({
  base: `${FOLDER}/${crop.name}`,
  widths: crop.widths,
  width: crop.width,
  height: crop.height,
})

async function card(outDir, name, width, height, hue, withPortrait) {
  const input = testCard(width, height, hue)
  const image = {
    alt: 'Test card, not game media',
    landscape: toCrop(await writeVariants({ input, outDir, name, widths: LANDSCAPE_WIDTHS })),
  }

  if (withPortrait) {
    image.portrait = toCrop(
      await writeVariants({
        input,
        outDir,
        name: `${name}-portrait`,
        widths: PORTRAIT_WIDTHS,
        aspect: 4 / 5,
      }),
    )
  }

  return image
}

/**
 * Builds a copy of the site, inside .checks/, whose media slots are filled
 * with test cards. Returns the folder it was built into.
 */
export async function buildFixture(work) {
  const mediaDir = join(work, 'fixture-media')

  /* The hero has a portrait crop and the feature does not, so both paths are tested. */
  const hero = await card(mediaDir, 'hero', 2400, 1350, 28, true)
  const feature = await card(mediaDir, 'feature', 2400, 1350, 200, false)
  const gallery = [
    await card(mediaDir, 'wide', 2400, 1350, 120, false),
    await card(mediaDir, 'square', 1600, 1600, 300, false),
    await card(mediaDir, 'tall', 1200, 1600, 60, false),
  ]

  const patch = `
;(() => {
  sheriffTownVr.media.hero.image = ${JSON.stringify(hero)}
  sheriffTownVr.media.feature.image = ${JSON.stringify(feature)}
  sheriffTownVr.media.gallery = ${JSON.stringify(gallery)}
})()
`
  const outDir = join(work, 'fixture-dist')
  await build({
    root,
    logLevel: 'error',
    build: { outDir, emptyOutDir: true },
    plugins: [
      {
        name: 'praamix:fixture-media',
        enforce: 'pre',
        transform(code, id) {
          return id.replaceAll('\\', '/').endsWith('/src/content/site.ts') ? code + patch : null
        },
      },
    ],
  })
  await cp(mediaDir, join(outDir, 'media', '__fixture__'), { recursive: true })

  return outDir
}
