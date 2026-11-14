import { GAME, HERO, pause, readWeight, scrollTrace, sectionInView, settle } from './page.mjs'

const DESKTOP = { width: 1440, height: 900 }

const studioLink = (page) =>
  page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Studio' })

async function hoverMedia(page) {
  const box = await page.locator(HERO).boundingBox()
  await page.mouse.move(box.x + box.width * 0.85, box.y + box.height * 0.25, { steps: 8 })
}

/** The signature interaction with a mouse: lean, press, settle. */
export async function checkPointer(browser, base, report) {
  const context = await browser.newContext({ viewport: DESKTOP })
  const page = await context.newPage()

  await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.masthead')
  const entrance = await page.evaluate(() => document.getAnimations().length)
  report.check('the masthead A tips over once on arrival', entrance > 0, `${entrance} animation`)

  await settle(page)
  const glide = await scrollTrace(page, () => studioLink(page).click())
  report.check(
    'a section link glides down the page to its section',
    glide.length > 4 && (await sectionInView(page, 'studio')),
    `${glide.length} scroll positions on the way`,
  )

  await page.goto(base + GAME, { waitUntil: 'networkidle' })
  await settle(page)
  const rest = await readWeight(page, HERO)

  await hoverMedia(page)
  await pause(900)
  const lean = await readWeight(page, HERO)
  report.check(
    'the media leans towards the pointer',
    lean.x > 0.4 && lean.y < -0.2 && lean.transform !== rest.transform,
    `lean ${lean.x.toFixed(2)} across, ${lean.y.toFixed(2)} down`,
  )

  await page.mouse.down()
  await pause(600)
  const press = await readWeight(page, HERO)
  await page.mouse.up()
  report.check('pressing pushes the media down', press.p > 0.8, `press ${press.p.toFixed(2)}`)

  await page.mouse.move(6, 6, { steps: 2 })
  let lowest = 1
  for (let i = 0; i < 30; i += 1) {
    await pause(50)
    lowest = Math.min(lowest, (await readWeight(page, HERO)).x)
  }
  const after = await readWeight(page, HERO)
  report.check(
    'the media settles when the pointer leaves',
    after.x === 0 && after.y === 0 && after.p === 0 && !after.moving,
    `swings to ${lowest.toFixed(3)} past rest, then stops`,
  )

  await context.close()
}

/** With the reduced-motion preference set, nothing should move. */
export async function checkReducedMotion(browser, base, report) {
  const context = await browser.newContext({ viewport: DESKTOP, reducedMotion: 'reduce' })
  const page = await context.newPage()

  await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.masthead')
  const home = await page.evaluate(() => ({
    animations: document.getAnimations().length,
    leaning:
      getComputedStyle(document.querySelector('.masthead .wordmark__a')).transform !== 'none',
  }))
  report.check('no entrance animation', home.animations === 0, `${home.animations} animations`)
  report.check('the masthead still shows its leaning A, without the movement', home.leaning)

  await settle(page)
  const jump = await scrollTrace(page, () => studioLink(page).click())
  report.check(
    'a section link jumps straight to its section, with no animated scrolling',
    jump.length <= 2 && (await sectionInView(page, 'studio')),
    `${jump.length} scroll positions: ${jump.join(', ')}`,
  )

  await page.goto(base + GAME, { waitUntil: 'networkidle' })
  await settle(page)
  await hoverMedia(page)
  await page.mouse.down()
  await pause(500)
  const state = await readWeight(page, HERO)
  await page.mouse.up()
  report.check(
    'the media stays still under the pointer and when pressed',
    state.x === 0 && state.p === 0 && !state.moving && state.transform === 'none',
  )

  await studioLink(page).click()
  await page.waitForURL('**/#studio', { timeout: 5000 }).catch(() => {})
  await settle(page)
  const arrived = (await sectionInView(page, 'studio')) && new URL(page.url()).pathname === '/'
  report.check('a section link on the game page still opens that section of the homepage', arrived)

  await context.close()
}
