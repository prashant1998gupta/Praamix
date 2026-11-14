import { GAME, pause, readWeight, scrollRest, settle } from './page.mjs'

/** Everything reachable and operable with Tab and Enter alone. */
export async function checkKeyboard(browser, base, report) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await context.newPage()

  const focused = () =>
    page.evaluate(() => {
      const el = document.activeElement
      if (!el || el === document.body) return null
      const ring = (style) =>
        style.outlineStyle !== 'none' && Number.parseFloat(style.outlineWidth) >= 2
      const rect = el.getBoundingClientRect()
      const namedBy = document.getElementById(el.getAttribute('aria-labelledby') ?? '')
      const name = el.getAttribute('aria-label') || namedBy?.textContent || el.textContent || ''
      return {
        label: name.trim().replace(/\s+/g, ' '),
        id: el.id,
        ring: ring(getComputedStyle(el)) || ring(getComputedStyle(el, '::after')),
        inView: rect.bottom > 0 && rect.top < window.innerHeight,
      }
    })

  const open = async (path) => {
    await page.goto(base + path, { waitUntil: 'networkidle' })
    await settle(page)
  }

  const tabTo = async (label) => {
    for (let i = 0; i < 30; i += 1) {
      await page.keyboard.press('Tab')
      if ((await focused())?.label === label) return true
    }
    return false
  }

  for (const [name, path] of [
    ['homepage', '/'],
    ['game page', GAME],
  ]) {
    await open(path)
    const stops = []
    for (let i = 0; i < 40; i += 1) {
      await page.keyboard.press('Tab')
      await scrollRest(page)
      const stop = await focused()
      if (!stop) break
      stops.push(stop)
    }
    const bad = stops.filter((stop) => !stop.ring || !stop.inView)
    report.check(
      `every Tab stop on the ${name} shows a focus ring and is scrolled into view`,
      stops.length > 0 && bad.length === 0,
      `${stops.length} stops`,
    )
    report.note(`order: ${stops.map((stop) => stop.label).join(' > ')}`)
    for (const stop of bad) {
      report.note(`"${stop.label}": ${stop.ring ? 'off screen' : 'no visible focus ring'}`)
    }
  }

  await open('/')
  await page.keyboard.press('Tab')
  const first = await focused()
  await page.keyboard.press('Enter')
  report.check(
    'the first Tab stop is a skip link, and Enter moves focus to the page content',
    first?.label === 'Skip to content' && (await focused())?.id === 'main',
  )

  await open('/')
  await tabTo('Studio')
  await page.keyboard.press('Enter')
  await scrollRest(page)
  const section = await page.evaluate(() => ({
    hash: window.location.hash,
    id: document.activeElement.id,
  }))
  report.check(
    'Enter on Studio goes to the studio section and puts focus there',
    section.hash === '#studio' && section.id === 'studio',
  )

  await open('/')
  await tabTo('Sheriff Town VR')
  await page.keyboard.press('Tab')
  await pause(120)
  const nod = await readWeight(page, '.feature__card [data-weight]')
  report.check(
    'the featured media nods when its link takes keyboard focus',
    nod.moving && nod.p !== 0,
    `press ${nod.p.toFixed(2)}`,
  )

  await page.keyboard.press('Enter')
  await page.waitForURL(`**${GAME}`, { timeout: 5000 }).catch(() => {})
  await settle(page)
  const arrived = await page.evaluate(() => ({
    path: window.location.pathname,
    id: document.activeElement.id,
    y: window.scrollY,
    title: document.title,
  }))
  report.check(
    'Enter on the featured game opens its page at the top, with focus on the content',
    arrived.path === GAME && arrived.id === 'main' && arrived.y === 0,
    `focus on "${arrived.id || 'nothing'}", scrolled to ${Math.round(arrived.y)}px, title "${arrived.title}"`,
  )

  await context.close()
}
