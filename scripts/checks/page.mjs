export const GAME = '/games/sheriff-town-vr'
export const HERO = '.game-hero__figure [data-weight]'

export const pause = (ms) => new Promise((done) => setTimeout(done, ms))

/** Waits for fonts, entrance animations and layout to finish. */
export async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all(
      document.getAnimations().map((animation) => animation.finished.catch(() => {})),
    )
    await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)))
  })
}

/** Waits until the page has stopped scrolling. */
export async function scrollRest(page) {
  let last = -1
  let still = 0

  for (let i = 0; i < 60 && still < 3; i += 1) {
    await pause(80)
    const y = await page.evaluate(() => Math.round(window.scrollY))
    still = y === last ? still + 1 : 0
    last = y
  }
}

/**
 * Performs an action, then returns every distinct scroll position the page
 * passed through until it came to rest. A jump gives two; a glide gives many.
 */
export async function scrollTrace(page, action) {
  await page.evaluate(() => {
    window.__trace = []
    const tick = () => {
      window.__trace.push(Math.round(window.scrollY))
      window.__traceTimer = requestAnimationFrame(tick)
    }
    tick()
  })
  await action()
  await scrollRest(page)

  return page.evaluate(() => {
    cancelAnimationFrame(window.__traceTimer)
    return [...new Set(window.__trace)]
  })
}

/** Reads the state of a weighted media frame: lean (x, y), press (p), and whether it is moving. */
export function readWeight(page, selector) {
  return page.evaluate((target) => {
    const frame = document.querySelector(target)
    const value = (name) => Number.parseFloat(frame.style.getPropertyValue(name)) || 0

    return {
      x: value('--wx'),
      y: value('--wy'),
      p: value('--wp'),
      moving: 'moving' in frame.dataset,
      transform: getComputedStyle(frame.querySelector('.weighted__body')).transform,
    }
  }, selector)
}

/** True when the section with this id is on screen. */
export function sectionInView(page, id) {
  return page.evaluate((target) => {
    const rect = document.getElementById(target).getBoundingClientRect()
    return rect.top < window.innerHeight * 0.75 && rect.bottom > 0
  }, id)
}
