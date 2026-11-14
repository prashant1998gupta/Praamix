/*
 * Renders the built site in a browser installed on this machine, at a range of
 * emulated screen sizes and input types, and reports what it finds.
 *
 *   npm run build
 *   npm run check:responsive
 *
 * This is emulation inside desktop Chrome or Edge. It does not replace trying
 * the site on real phones, tablets and other browsers (Safari, Firefox).
 *
 * Results are printed and saved to .checks/report.txt, with screenshots in
 * .checks/screens/. The .checks folder is rebuilt on every run and is not
 * committed.
 */
import { existsSync } from 'node:fs'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { launchBrowser, root, serve } from './checks/browser.mjs'
import { checkKeyboard } from './checks/keyboard.mjs'
import {
  checkDirectLoad,
  checkFontFailure,
  checkStability,
  reportFontMetrics,
} from './checks/loading.mjs'
import { checkMedia } from './checks/media.mjs'
import { checkPointer, checkReducedMotion } from './checks/pointer.mjs'
import { createReport } from './checks/report.mjs'
import { runMatrix, runSweep } from './checks/screens.mjs'
import { runTextSize } from './checks/textsize.mjs'
import { checkTouch } from './checks/touch.mjs'

if (!existsSync(join(root, 'dist', 'index.html'))) {
  console.error('Nothing to check yet. Run `npm run build` first.')
  process.exit(1)
}

const work = join(root, '.checks')
const shots = join(work, 'screens')
await rm(work, { recursive: true, force: true })
await mkdir(shots, { recursive: true })

const report = createReport()
const { browser, name } = await launchBrowser()
const site = await serve('dist', 4300)
const base = site.url

report.section('Praamix responsive checks')
report.note(`Browser: ${name}`)
report.note('Emulated screens in a desktop browser. These are not tests on physical devices.')

/* `npm run check:responsive -- keyboard touch` runs only the sections whose titles contain those words. */
const only = process.argv.slice(2).map((word) => word.toLowerCase())
if (only.length > 0) report.note(`Partial run: only sections matching "${only.join('", "')}".`)

/* One section failing to run should not hide the results of the others. */
async function run(title, task) {
  if (only.length > 0 && !only.some((word) => title.toLowerCase().includes(word))) return
  report.section(title)
  try {
    await task()
  } catch (error) {
    const reason = String(error?.stack ?? error)
      .split('\n')
      .slice(0, 3)
      .join(' | ')
    report.check(`"${title}" ran to the end`, false, reason)
  }
}

await run('Both pages at fixed screen sizes', () => runMatrix(browser, base, report, shots))
await run('Resizing the window continuously', () => runSweep(browser, base, report))
await run('Text enlarged to 200%', () => runTextSize(browser, base, report, shots))
await run('Mouse', () => checkPointer(browser, base, report))
await run('Touch', () => checkTouch(browser, base, report))
await run('Keyboard', () => checkKeyboard(browser, base, report))
await run('Reduced motion', () => checkReducedMotion(browser, base, report))
await run('Direct loading, refresh and history', () => checkDirectLoad(browser, base, report))
await run('Layout stability while fonts load', async () => {
  await checkStability(browser, base, report)
  await checkFontFailure(browser, base, report, shots)
  await reportFontMetrics(browser, base, report)
})
await run('Image loading, using drawn test cards in place of game media', () =>
  checkMedia(browser, report, work, shots),
)

report.section(
  report.failed === 0
    ? `All ${report.passed} checks passed.`
    : `${report.failed} of ${report.passed + report.failed} checks failed.`,
)

await writeFile(join(work, 'report.txt'), report.text())
await browser.close()
await site.close()
process.exit(report.failed === 0 ? 0 : 1)
