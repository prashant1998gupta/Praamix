import { devices } from 'playwright-core'
import { GAME, HERO, pause, readWeight, scrollRest, sectionInView, settle } from './page.mjs'

/** Navigation and the signature interaction using touch events only. */
export async function checkTouch(browser, base, report) {
  const context = await browser.newContext({ ...devices['Pixel 7'] })
  const page = await context.newPage()
  await page.goto(`${base}/`, { waitUntil: 'networkidle' })
  await settle(page)

  const size = page.viewportSize()
  report.note(
    `Emulated phone: Pixel 7 profile, ${size.width}x${size.height}, touch events, in the desktop browser.`,
  )

  const input = await page.evaluate(() => ({
    coarse: window.matchMedia('(pointer: coarse)').matches,
    hover: window.matchMedia('(hover: hover)').matches,
  }))
  report.check('the page sees a coarse pointer with no hover', input.coarse && !input.hover)

  await page
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: 'Studio' })
    .tap()
  await scrollRest(page)
  report.check(
    'tapping Studio in the navigation brings the studio section into view',
    (await sectionInView(page, 'studio')) && new URL(page.url()).hash === '#studio',
  )

  const media = page.locator('.feature__media')
  await media.scrollIntoViewIfNeeded()
  await scrollRest(page)
  const frame = await media.boundingBox()
  await page.touchscreen.tap(frame.x + frame.width / 2, frame.y + frame.height / 2)
  await page.waitForURL(`**${GAME}`, { timeout: 5000 }).catch(() => {})
  report.check(
    'tapping the featured image (not only its title) opens the game page',
    new URL(page.url()).pathname === GAME,
  )
  await settle(page)

  const hero = page.locator(HERO)
  await hero.scrollIntoViewIfNeeded()
  await scrollRest(page)
  const box = await hero.boundingBox()
  const point = {
    x: Math.round(box.x + box.width / 2),
    y: Math.round(Math.min(Math.max(box.y + box.height / 2, 80), size.height - 80)),
  }
  const cdp = await context.newCDPSession(page)

  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] })
  await pause(350)
  const held = await readWeight(page, HERO)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await pause(1500)
  const released = await readWeight(page, HERO)
  report.check(
    'the media presses down under a finger and settles on release',
    held.p > 0.6 && released.p === 0 && !released.moving,
    `pressed to ${held.p.toFixed(2)}`,
  )

  /* A finger dragged 300px up the middle of the screen. Returns how far the page scrolled. */
  const swipeUp = async (fromY) => {
    const x = Math.round(size.width / 2)
    const before = await page.evaluate(() => window.scrollY)
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x, y: fromY }],
    })
    for (let step = 1; step <= 12; step += 1) {
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x, y: fromY - step * 25 }],
      })
      await pause(16)
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await scrollRest(page)
    return (await page.evaluate(() => window.scrollY)) - before
  }
  const lowOnScreen = Math.round(size.height * 0.75)

  /* First on plain text, to find out whether this browser can simulate a dragging finger at all. */
  await page.evaluate(() =>
    document.querySelector('.identity').scrollIntoView({ block: 'start', behavior: 'instant' }),
  )
  const control = await swipeUp(lowOnScreen)

  if (control < 100) {
    report.note(
      `Not checked: a swipe starting on the media. This browser did not scroll for a simulated finger even over plain text (${Math.round(control)}px).`,
    )
  } else {
    await page.evaluate((selector) => {
      const top = document.querySelector(selector).getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: top - window.innerHeight * 0.35, behavior: 'instant' })
    }, HERO)
    const moved = await swipeUp(lowOnScreen)
    await pause(1200)
    const afterSwipe = await readWeight(page, HERO)
    report.check(
      'a swipe that starts on the media scrolls the page as normal',
      moved > 150 && afterSwipe.p === 0 && !afterSwipe.moving,
      `scrolled ${Math.round(moved)}px; the same swipe over plain text scrolled ${Math.round(control)}px`,
    )
  }

  await page.getByRole('link', { name: 'Back to Praamix' }).tap()
  await page.waitForURL(`${base}/`, { timeout: 5000 }).catch(() => {})
  report.check(
    'tapping Back to Praamix returns to the homepage',
    new URL(page.url()).pathname === '/',
  )

  await context.close()
}
