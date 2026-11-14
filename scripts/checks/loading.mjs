import { join } from 'node:path'
import { GAME, pause, scrollRest, sectionInView, settle } from './page.mjs'
import { measure } from './probes.mjs'

/** Opening pages from their own address, refreshing them, and using back and forward. */
export async function checkDirectLoad(browser, base, report) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  const state = () =>
    page.evaluate(() => ({
      path: window.location.pathname,
      h1: (document.querySelector('h1')?.textContent ?? '').trim().replace(/\s+/g, ' '),
      title: document.title,
    }))

  const response = await page.goto(base + GAME, { waitUntil: 'networkidle' })
  let now = await state()
  report.check(
    'the game page opens from its own address',
    response.status() === 200 && now.h1 === 'Sheriff Town VR',
    `title "${now.title}"`,
  )

  await page.reload({ waitUntil: 'networkidle' })
  now = await state()
  report.check('the game page survives a refresh', now.path === GAME && now.h1 === 'Sheriff Town VR')

  const raw = await (await context.request.get(`${base}${GAME}/`)).text()
  report.check(
    'the file served for the game page carries its own title before any script runs',
    raw.includes('<title>Sheriff Town VR · Praamix</title>'),
  )

  await page.goto(`${base}/`, { waitUntil: 'networkidle' })
  await page.reload({ waitUntil: 'networkidle' })
  now = await state()
  report.check('the homepage survives a refresh', now.path === '/' && now.h1.startsWith('Praamix'))

  await page.goto(`${base}/#contact`, { waitUntil: 'networkidle' })
  await scrollRest(page)
  const focus = await page.evaluate(() => document.activeElement.id)
  report.check(
    'an address ending in #contact opens at the contact section',
    focus === 'contact' && (await sectionInView(page, 'contact')),
  )

  await page.goto(`${base}/no-such-page`, { waitUntil: 'networkidle' })
  now = await state()
  report.check('an unknown address shows the not-found page', now.h1 === 'Nothing at this address.')

  await page.goto(`${base}/`, { waitUntil: 'networkidle' })
  await page.getByRole('link', { name: 'Sheriff Town VR' }).first().click()
  await page.waitForURL(`**${GAME}`, { timeout: 5000 }).catch(() => {})
  await page.goBack()
  await pause(200)
  const back = (await state()).path
  await page.goForward()
  await pause(200)
  const forward = (await state()).path
  report.check('back and forward move between the two pages', back === '/' && forward === GAME)

  await context.close()
}

/** Holds the fonts back, then measures how far the layout moves when they arrive. */
export async function checkStability(browser, base, report) {
  const sizes = [
    ['phone 375x667', 375, 667, 2],
    ['laptop 1440x900', 1440, 900, 1],
  ]

  for (const [label, width, height, dpr] of sizes) {
    for (const [name, path] of [
      ['home', '/'],
      ['game', GAME],
    ]) {
      const context = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: dpr,
      })
      const page = await context.newPage()
      await page.route('**/*.woff2', async (route) => {
        await pause(1200)
        await route.continue()
      })
      await page.addInitScript(() => {
        window.__shift = 0
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) window.__shift += entry.value
          }
        }).observe({ type: 'layout-shift', buffered: true })
      })

      await page.goto(base + path, { waitUntil: 'domcontentloaded' })
      await page.waitForSelector('main')
      await pause(350)
      /* Confirms the delay took hold: the fonts should still be on their way at this point. */
      const waiting = await page.evaluate(() => document.fonts.status)
      await settle(page)
      await pause(500)
      const shift = await page.evaluate(() => window.__shift)

      report.check(
        `${name}, ${label}, fonts held back 1.2s`,
        shift < 0.05 && waiting === 'loading',
        `layout shift score ${shift.toFixed(4)}; fonts ${waiting} at 350ms`,
      )
      await context.close()
    }
  }
}

/** Blocks the web fonts altogether and checks that the stand-in faces still fit the screen. */
export async function checkFontFailure(browser, base, report, shots) {
  const sizes = [
    [320, 568],
    [375, 667],
    [768, 1024],
    [1440, 900],
  ]

  for (const [name, path] of [
    ['home', '/'],
    ['game', GAME],
  ]) {
    const bad = []
    for (const [width, height] of sizes) {
      const context = await browser.newContext({ viewport: { width, height } })
      const page = await context.newPage()
      await page.route('**/*.woff2', (route) => route.abort())
      await page.goto(base + path, { waitUntil: 'networkidle' })
      await page.waitForSelector('main')
      await pause(400)

      const result = await page.evaluate(measure)
      if (width === 375 || width === 1440) {
        await page.screenshot({
          path: join(shots, `fonts-failed-${name}-${width}.jpg`),
          type: 'jpeg',
          quality: 80,
          scale: 'css',
        })
      }
      /* Stand-in type is allowed to be smaller than intended. It is not allowed to overflow. */
      for (const problem of result.problems) {
        if (!problem.includes('fills only')) bad.push(`${width}px: ${problem}`)
      }
      await context.close()
    }

    report.check(
      `${name}: nothing overflows or is cut off when the web fonts fail to load`,
      bad.length === 0,
      `at ${sizes.map(([width]) => width).join(', ')}px wide`,
    )
    for (const line of bad) report.note(line)
  }
}

/** Compares the web fonts with their stand-ins, to tune size-adjust in fonts.css. */
export async function reportFontMetrics(browser, base, report) {
  const page = await browser.newPage()
  await page.goto(`${base}/`, { waitUntil: 'networkidle' })
  await settle(page)

  const ratios = await page.evaluate(() => {
    const sample = 'Arrests and non-lethal takedowns are at the centre of the game.'
    const width = (font) => {
      const span = document.createElement('span')
      span.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;font:${font}`
      span.textContent = sample
      document.body.append(span)
      const result = span.getBoundingClientRect().width
      span.remove()
      return result
    }
    return {
      sans: width("400 100px 'Archivo Variable'") / width('400 100px Arial'),
      serif: width("italic 400 100px 'Instrument Serif'") / width('italic 400 100px Georgia'),
    }
  })

  report.note(
    `Stand-in fonts on this machine: Archivo sets ${ratios.sans.toFixed(3)} times the width of Arial; ` +
      `Instrument Serif italic sets ${ratios.serif.toFixed(3)} times the width of Georgia italic.`,
  )
  await page.close()
}
