import { join } from 'node:path'
import { GAME, settle } from './page.mjs'
import { measure } from './probes.mjs'
import { saveSheet } from './sheet.mjs'

export const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'game', path: GAME },
]

const screen = (size, note, dpr = 1, touch = false) => {
  const [width, height] = size.split('x').map(Number)
  return { size, note, width, height, dpr, touch }
}

/* Sizes are CSS pixels. `touch` also switches on the browser's mobile emulation. */
export const SCREENS = [
  screen('280x653', 'folded foldable', 3, true),
  screen('320x568', 'small phone', 2, true),
  screen('375x667', 'phone', 2, true),
  screen('430x932', 'large phone', 3, true),
  screen('540x720', 'one side of a dual-screen device', 2, true),
  screen('768x1024', 'tablet, upright', 2, true),
  screen('884x1104', 'unfolded foldable', 2, true),
  screen('1024x768', 'tablet on its side, small laptop', 2, true),
  screen('1440x900', 'laptop'),
  screen('1920x1080', 'desktop'),
  screen('2560x1440', 'large desktop'),
  screen('3440x1440', 'ultrawide'),
  screen('568x320', 'small phone on its side', 2, true),
  screen('667x375', 'phone on its side', 2, true),
  screen('844x390', 'large phone on its side', 3, true),
  screen('412x400', 'split-screen window', 2.625, true),
  screen('720x450', '1440×900 at 200% zoom', 2),
  screen('640x360', '1280×720 at 200% zoom', 2),
  screen('320x256', '1280×1024 at 400% zoom', 4),
]

export function summarise(result) {
  const parts = []
  if (result.fits.masthead) parts.push(`masthead fills ${result.fits.masthead}`)
  if (result.fits.title) {
    parts.push(`title fills ${result.fits.title} on ${result.fits.titleLines} line(s)`)
  }
  parts.push(`smallest text ${result.smallestText}px`)
  if (result.longestLine) parts.push(`longest line ${result.longestLine} characters`)
  if (result.firstScreen !== null) {
    parts.push(result.firstScreen ? 'game link on first screen' : 'game link below first screen')
  }
  return parts.join(', ')
}

export async function runMatrix(browser, base, report, shots) {
  for (const item of SCREENS) {
    for (const route of ROUTES) {
      const context = await browser.newContext({
        viewport: { width: item.width, height: item.height },
        deviceScaleFactor: item.dpr,
        hasTouch: item.touch,
        isMobile: item.touch,
      })
      const page = await context.newPage()
      await page.goto(base + route.path, { waitUntil: 'networkidle' })
      await settle(page)

      const result = await page.evaluate(measure)
      /* On a screen of ordinary height, the way into the game should not need scrolling. */
      if (result.firstScreen === false && item.height >= 560) {
        result.problems.push('the link to the game is below the first screen')
      }
      await saveSheet(page, join(shots, `${route.name}-${item.size}.jpg`), item)

      report.check(
        `${route.name} ${item.size} (${item.note})`,
        result.problems.length === 0,
        summarise(result),
      )
      for (const problem of result.problems) report.note(problem)
      await context.close()
    }
  }
}

/** Drags the window width through a range and measures at every step. */
export async function runSweep(browser, base, report) {
  const passes = [
    { label: 'window 900px high', from: 280, to: 2600, step: 20, height: 900 },
    { label: 'window 360px high', from: 480, to: 1100, step: 20, height: 360 },
  ]

  for (const route of ROUTES) {
    for (const pass of passes) {
      const context = await browser.newContext({
        viewport: { width: pass.from, height: pass.height },
      })
      const page = await context.newPage()
      await page.goto(base + route.path, { waitUntil: 'networkidle' })
      await settle(page)

      const bad = []
      const range = { masthead: [9, 0], title: [9, 0] }
      for (let width = pass.from; width <= pass.to; width += pass.step) {
        await page.setViewportSize({ width, height: pass.height })
        await settle(page)
        const result = await page.evaluate(measure)
        for (const problem of result.problems) bad.push(`${width}px: ${problem}`)
        for (const key of ['masthead', 'title']) {
          if (!result.fits[key]) continue
          range[key][0] = Math.min(range[key][0], result.fits[key])
          range[key][1] = Math.max(range[key][1], result.fits[key])
        }
      }

      const fills = Object.entries(range)
        .filter(([, [low]]) => low !== 9)
        .map(([key, [low, high]]) => `${key} fills ${low} to ${high}`)
      report.check(
        `${route.name}, ${pass.from}px to ${pass.to}px in ${pass.step}px steps, ${pass.label}`,
        bad.length === 0,
        fills.join(', '),
      )
      for (const line of bad.slice(0, 10)) report.note(line)
      if (bad.length > 10) report.note(`and ${bad.length - 10} more`)
      await context.close()
    }
  }
}
