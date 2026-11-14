import { join } from 'node:path'
import { serve } from './browser.mjs'
import { buildFixture } from './fixture.mjs'
import { GAME, settle } from './page.mjs'
import { measure } from './probes.mjs'
import { saveSheet } from './sheet.mjs'

/** Runs in the page: which file each frame loaded, against what the frame needs. */
function imageReport() {
  return [...document.querySelectorAll('.plate__img')].map((img) => {
    const rect = img.getBoundingClientRect()
    const shape = img.naturalWidth / img.naturalHeight
    const needed = Math.max(rect.width, rect.height * shape) * window.devicePixelRatio
    const base = img.currentSrc.replace(/-\d+\.webp$/, '')
    const sets = [
      img.srcset,
      ...[...img.parentElement.querySelectorAll('source')].map((source) => source.srcset),
    ]
    const widths = [...sets.join(', ').matchAll(/(\S+)-\d+\.webp\s+(\d+)w/g)]
      .filter((match) => base.endsWith(match[1]))
      .map((match) => Number(match[2]))
    /* The file's real width is in its name. naturalWidth will not do: the browser scales it by the sizes hint. */
    const fileWidth = Number(img.currentSrc.match(/-(\d+)\.webp$/)?.[1] ?? 0)
    const ratio = fileWidth / needed

    return {
      file: img.currentSrc.split('/').pop(),
      loaded: img.complete && img.naturalWidth > 0,
      natural: fileWidth,
      needed: Math.round(needed),
      oversized: ratio > 1.75 && fileWidth > Math.min(...widths),
      undersized: ratio < 0.85 && fileWidth < Math.max(...widths),
    }
  })
}

/** Scrolls through the page so that lazily loaded images are fetched. */
async function loadAllImages(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight / 2) {
      window.scrollTo({ top: y, behavior: 'instant' })
      await new Promise((done) => setTimeout(done, 80))
    }
    await Promise.all([...document.images].map((img) => img.decode().catch(() => {})))
    window.scrollTo({ top: 0, behavior: 'instant' })
  })
  await page.waitForLoadState('networkidle')
}

const SIZES = [
  [375, 667, 2],
  [430, 932, 3],
  [768, 1024, 2],
  [844, 390, 3],
  [1440, 900, 1],
  [2560, 1440, 1],
]

/**
 * Fills the media slots with test cards, then checks that every frame loads a
 * file of a sensible size for the screen and that the layouts hold with images in.
 */
export async function checkMedia(browser, report, work, shots) {
  const site = await serve(await buildFixture(work), 4310)

  try {
    for (const [width, height, dpr] of SIZES) {
      for (const [name, path] of [
        ['home', '/'],
        ['game', GAME],
      ]) {
        const context = await browser.newContext({
          viewport: { width, height },
          deviceScaleFactor: dpr,
          isMobile: width < 1100,
          hasTouch: width < 1100,
        })
        const page = await context.newPage()
        await page.goto(site.url + path, { waitUntil: 'networkidle' })
        await settle(page)
        await loadAllImages(page)

        const images = await page.evaluate(imageReport)
        const layout = await page.evaluate(measure)
        await saveSheet(page, join(shots, `media-${name}-${width}x${height}.jpg`), { height })

        const bad = images.filter((image) => !image.loaded || image.oversized || image.undersized)
        report.check(
          `${name} ${width}x${height} at ${dpr}x`,
          images.length > 0 && bad.length === 0 && layout.problems.length === 0,
          images.map((image) => `${image.file} for ${image.needed}px`).join(', '),
        )
        for (const image of bad) {
          const why = !image.loaded
            ? 'did not load'
            : image.oversized
              ? 'larger than needed'
              : 'too small'
          report.note(
            `${image.file}: ${why} (file is ${image.natural}px wide, frame needs ${image.needed}px)`,
          )
        }
        for (const problem of layout.problems) report.note(problem)
        await context.close()
      }
    }
  } finally {
    await site.close()
  }
}
