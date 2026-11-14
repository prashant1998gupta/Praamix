import { join } from 'node:path'
import { launchBrowser } from './browser.mjs'
import { settle } from './page.mjs'
import { measure } from './probes.mjs'
import { ROUTES, summarise } from './screens.mjs'
import { saveSheet } from './sheet.mjs'

const SIZES = [
  [375, 667],
  [768, 1024],
  [1280, 800],
  [1920, 1080],
]

async function run(browser, base, report, shots, tag, label, prepare) {
  for (const [width, height] of SIZES) {
    for (const route of ROUTES) {
      const context = await browser.newContext({ viewport: { width, height } })
      const page = await context.newPage()
      await page.goto(base + route.path, { waitUntil: 'networkidle' })
      await prepare(page)
      await settle(page)

      const result = await page.evaluate(measure)
      await saveSheet(page, join(shots, `${route.name}-${tag}-${width}x${height}.jpg`), { height })
      report.check(
        `${route.name} ${width}x${height}, ${label}`,
        result.problems.length === 0,
        summarise(result),
      )
      for (const problem of result.problems) report.note(problem)
      await context.close()
    }
  }
}

/**
 * Text at twice its normal size, two ways:
 *   1. the browser's own font-size setting, which the layout breakpoints follow
 *   2. text doubled while the layout stays put, as with a text-only zoom
 */
export async function runTextSize(browser, base, report, shots) {
  const large = await launchBrowser(['--blink-settings=defaultFontSize=32'])
  const probe = await large.browser.newPage()
  await probe.goto(`${base}/`)
  const rootSize = await probe.evaluate(() =>
    Number.parseFloat(getComputedStyle(document.documentElement).fontSize),
  )
  await probe.close()

  if (rootSize >= 31.5) {
    report.note('Method 1: browser font size set to 32px. Layout breakpoints follow the text size.')
    await run(large.browser, base, report, shots, 'text32', 'browser font size 32px', async () => {})
  } else {
    report.note(
      `Method 1 not run: this browser ignored the font-size setting (text stayed at ${rootSize}px).`,
    )
  }
  await large.browser.close()

  report.note('Method 2: text doubled while the layout keeps its breakpoints (text-only zoom).')
  await run(browser, base, report, shots, 'textonly', 'text-only zoom 200%', (page) =>
    page.addStyleTag({ content: 'html { font-size: 200% !important; }' }),
  )
}
