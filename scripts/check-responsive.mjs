/*
 * Renders the built site in a browser installed on this machine and reports
 * what it finds.
 *
 *   npm run build
 *   npm run check:responsive
 *
 * Every page is opened at the screen widths in the brief, plus a short
 * landscape phone. Each one is checked for sideways scrolling, broken
 * pictures, empty or "#" links, missing alt text and console errors. Then the
 * menu, the loader, slow and offline connections, the Dispatch board, the 3D showroom, the services track, the studio doors, the voiced lines, the gallery viewer, the key art, the homepage slideshow and logo, the Praamix logo, the trailer and the game’s channels, the project brief and its delivery, reduced motion, direct loading of
 * every address and the not-found page are exercised.
 *
 * This is emulation inside desktop Chrome or Edge. It does not replace trying
 * the site on real phones, tablets and other browsers (Safari, Firefox).
 *
 * Results are printed and saved to .checks/report.txt, with page sheets in
 * .checks/screens/. The .checks folder is rebuilt on every run and is not
 * committed.
 */
import { existsSync } from 'node:fs'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { launchBrowser, root, serve } from './checks/browser.mjs'
import { createReport } from './checks/report.mjs'
import { saveSheet } from './checks/sheet.mjs'
import { routes } from '../src/content/routes.ts'

if (!existsSync(join(root, 'dist', 'index.html'))) {
  console.error('Nothing to check yet. Run `npm run build` first.')
  process.exit(1)
}

const WIDTHS = [320, 375, 430, 768, 1024, 1440, 1920, 2560]
const HEIGHT = { 320: 640, 375: 812, 430: 932, 768: 1024, 1024: 768, 1440: 900, 1920: 1080, 2560: 1440 }
/* Page sheets are saved at these widths only, to keep the folder small. */
const SHEETS = new Set([375, 1440])

const work = join(root, '.checks')
const shots = join(work, 'screens')
await rm(work, { recursive: true, force: true })
await mkdir(shots, { recursive: true })

const report = createReport()
const { browser, name } = await launchBrowser()
const site = await serve('dist', 4300)
const base = site.url
const paths = routes.map((route) => route.path)

report.section('Praamix responsive checks')
report.note(`Browser: ${name}`)
report.note('Emulated screens in a desktop browser. These are not tests on physical devices.')

async function run(title, task) {
  report.section(title)
  try {
    await task()
  } catch (error) {
    report.check(`"${title}" ran to the end`, false, String(error?.message ?? error).split('\n')[0])
  }
}

async function open(viewport, options = {}) {
  const context = await browser.newContext({ viewport, ...options })
  const page = await context.newPage()
  const errors = []
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()))
  page.on('pageerror', (error) => errors.push(String(error)))
  return { context, page, errors }
}

/* Scrolls through the page so lazy pictures load, then returns to the top. */
async function settle(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y)
      await new Promise((done) => setTimeout(done, 60))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForLoadState('networkidle')
  /* Sections fade up as they arrive; let the last of them finish. */
  await page.waitForTimeout(1200)
}

const slug = (path) => (path === '/' ? 'home' : path.slice(1).replace(/\//g, '-'))

async function inspect(page) {
  return page.evaluate(() => {
    const root = document.documentElement
    const wide = [...document.querySelectorAll('body *')]
      .filter((element) => {
        const box = element.getBoundingClientRect()
        return box.width > 0 && box.right > root.clientWidth + 1 && !element.closest('[hidden]')
      })
      .slice(0, 3)
      .map((element) => `${element.tagName.toLowerCase()}.${[...element.classList].join('.')}`)
    return {
      overflow: root.scrollWidth - root.clientWidth,
      wide,
      broken: [...document.images].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.currentSrc || img.src),
      noAlt: [...document.images].filter((img) => !img.hasAttribute('alt')).length,
      badLinks: [...document.querySelectorAll('a')].filter((a) => {
        const href = a.getAttribute('href')
        return !href || href === '#'
      }).length,
      h1: document.querySelectorAll('h1').length,
      external: [...document.querySelectorAll('a[target="_blank"]')].filter((a) => !/noopener/.test(a.rel)).length,
    }
  })
}

await run('Every page at fixed screen sizes', async () => {
  for (const width of WIDTHS) {
    const { context, page, errors } = await open({ width, height: HEIGHT[width] })
    const problems = []
    for (const path of paths) {
      await page.goto(base + path, { waitUntil: 'networkidle' })
      await settle(page)
      const found = await inspect(page)
      if (found.overflow > 0) problems.push(`${path} scrolls sideways by ${found.overflow}px (${found.wide.join(', ')})`)
      if (found.broken.length) problems.push(`${path} broken pictures: ${found.broken.join(', ')}`)
      if (found.noAlt) problems.push(`${path} has ${found.noAlt} pictures with no alt attribute`)
      if (found.badLinks) problems.push(`${path} has ${found.badLinks} links with an empty or "#" address`)
      if (found.h1 !== 1) problems.push(`${path} has ${found.h1} main headings`)
      if (found.external) problems.push(`${path} opens ${found.external} new tabs without noopener`)
      if (SHEETS.has(width)) await saveSheet(page, join(shots, `${slug(path)}-${width}.jpg`), { height: HEIGHT[width] })
    }
    report.check(`${width}px wide`, problems.length === 0 && errors.length === 0, [...problems, ...errors].join(' | '))
    await context.close()
  }
})

await run('Short landscape phone', async () => {
  const { context, page } = await open({ width: 740, height: 360 }, { hasTouch: true, isMobile: true })
  for (const path of paths) {
    await page.goto(base + path, { waitUntil: 'networkidle' })
    const found = await inspect(page)
    report.check(`${path} fits at 740 by 360`, found.overflow <= 0, found.wide.join(', '))
  }
  await context.close()
})

await run('Menu on a phone', async () => {
  const { context, page } = await open({ width: 375, height: 812 }, { hasTouch: true, isMobile: true })
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  const button = page.locator('.menu-button')
  await button.tap()
  report.check('Tapping Menu opens the list', (await button.getAttribute('aria-expanded')) === 'true')
  report.check('Menu links are visible', await page.locator('.site-nav__link').first().isVisible())
  await page.keyboard.press('Escape')
  report.check('Escape closes it', (await button.getAttribute('aria-expanded')) === 'false')
  report.check('Focus returns to the Menu button', await button.evaluate((el) => el === document.activeElement))
  await button.tap()
  await page.locator('.site-nav__link', { hasText: 'Services' }).tap()
  await page.waitForURL('**/services')
  report.check('Choosing a link goes there and closes the menu', (await button.getAttribute('aria-expanded')) === 'false')
  const targets = await page.evaluate(() =>
    [...document.querySelectorAll('.btn, .menu-button, .dispatch__mode, .dispatch__map, .asset__look, .choice')]
      .filter((el) => el.getBoundingClientRect().width > 0)
      .filter((el) => el.getBoundingClientRect().height < 44).length,
  )
  report.check('Buttons are at least 44px tall', targets === 0, `${targets} smaller`)
  await context.close()
})

await run('Dispatch board with keyboard and pointer', async () => {
  const { context, page } = await open({ width: 1440, height: 900 })
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  const board = page.locator('.dispatch')
  const tabs = board.getByRole('tab')
  const heading = board.locator('.dispatch__text h3')
  const sandbox = await tabs.count()
  report.check('Sandbox lists five maps', sandbox === 5, `${sandbox} found`)
  const first = await heading.textContent()
  await tabs.nth(0).focus()
  await page.keyboard.press('ArrowRight')
  report.check('Arrow key selects the next map', (await tabs.nth(1).getAttribute('aria-selected')) === 'true')
  report.check('The picture and text change with it', (await heading.textContent()) !== first)
  await page.keyboard.press('End')
  report.check('End selects the last map', (await tabs.nth(sandbox - 1).getAttribute('aria-selected')) === 'true')
  await board.getByRole('button', { name: 'Challenge' }).click()
  const challenge = await tabs.count()
  report.check('Challenge lists two maps', challenge === 2, `${challenge} found`)
  await tabs.nth(1).click()
  report.check('Clicking selects a map', (await heading.textContent()) === 'The Colour Bridge')
  await context.close()
})

await run('Voiced lines and gallery viewer', async () => {
  const { context, page } = await open({ width: 1440, height: 900 })
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  const line = page.locator('.bubble__line')
  const before = await line.textContent()
  await page.getByRole('button', { name: 'Hear another' }).click()
  report.check('Hear another shows a different line', (await line.textContent()) !== before)

  await page.goto(base + '/games/sheriff-town-vr', { waitUntil: 'networkidle' })
  const shots = page.locator('#gallery .shot')
  report.check('The gallery has pictures', (await shots.count()) >= 6, `${await shots.count()} found`)
  await shots.nth(1).click()
  const viewer = page.locator('#gallery dialog.viewer')
  report.check('Selecting a picture opens the viewer', await viewer.evaluate((el) => el.open))
  const count = viewer.locator('.viewer__count')
  await page.keyboard.press('ArrowRight')
  report.check('Right arrow moves to the next picture', (await count.textContent())?.startsWith('3 of') === true)
  await page.keyboard.press('Escape')
  report.check('Escape closes the viewer', !(await viewer.evaluate((el) => el.open)))
  report.check('Focus returns to the picture that opened it', await shots.nth(1).evaluate((el) => el === document.activeElement))

  const posters = page.locator('#key-art .shot')
  report.check('The key art has twelve posters', (await posters.count()) === 12, `${await posters.count()} found`)
  await posters.first().click()
  const art = page.locator('#key-art dialog.viewer')
  report.check('Selecting a poster opens it large', await art.evaluate((el) => el.open))
  report.check('It is labelled as key art, not a capture', /Key art/.test((await art.locator('.viewer__kind').textContent()) ?? ''))
  await page.keyboard.press('Escape')
  await context.close()
})

await run('The homepage slideshow and the logo', async () => {
  const { context, page, errors } = await open({ width: 1440, height: 900 })
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  const show = page.locator('.marquee')
  const count = show.locator('.marquee__count')
  const number = async () => Number(((await count.textContent()) ?? '').match(/\d+/)?.[0])
  const heading = page.getByRole('heading', { level: 1 })
  report.check('The main heading reads Sheriff Town VR, shown as the logo', (await heading.textContent())?.trim() === 'Sheriff Town VR' && (await heading.locator('.game-logo img').count()) > 0)
  report.check('It opens on the in-game capture', (await show.getAttribute('data-kind')) === 'capture' && (await number()) === 1)
  report.check('Thirteen pictures: the capture and twelve posters', /13/.test((await count.textContent()) ?? ''), (await count.textContent()) ?? '')
  const posters = () => show.locator('.marquee__card img').count()
  report.check('Only the posters needed so far are fetched', (await posters()) <= 1, `${await posters()} of 12 loaded`)
  report.check('No poster is out while the capture shows', (await show.locator('.marquee__card[data-place="top"]').count()) === 0)

  const drum = show.getByRole('button', { name: 'Next picture' })
  await drum.click()
  report.check('The drum deals the first poster', (await number()) === 2 && (await show.getAttribute('data-kind')) === 'poster')
  report.check('A poster is named as key art', /Key art/i.test((await show.locator('.marquee__kind').textContent()) ?? ''))
  await page.waitForTimeout(1300)
  const card = await show.locator('.marquee__card[data-place="top"]').boundingBox()
  const text = await show.locator('.marquee__text').boundingBox()
  const opening = await show.boundingBox()
  report.check('The poster lands beside the words, not over them', Boolean(card && text && card.x >= text.x + text.width - 8), card && text ? `poster from ${Math.round(card.x)}px, words to ${Math.round(text.x + text.width)}px` : 'not found')
  report.check('The poster takes up less than half the opening', Boolean(card && opening && card.width * card.height < opening.width * opening.height * 0.5))
  report.check('The logo and the words stay as they were', (await show.locator('.marquee__logo').evaluate((el) => getComputedStyle(el).opacity)) === '1')
  await drum.click()
  await page.waitForTimeout(400)
  report.check('The next poster lands on top of the last', (await show.locator('.marquee__card[data-place="under"]').count()) === 1 && (await number()) === 3)
  await show.locator('.marquee__card[data-place="top"]').click()
  report.check('Pressing the top poster deals the next', (await number()) === 4)
  await show.getByRole('button', { name: 'Previous picture' }).click()
  await show.getByRole('button', { name: 'Previous picture' }).click()
  await show.getByRole('button', { name: 'Previous picture' }).click()
  report.check('Previous goes back', (await number()) === 1)

  /* Left alone, with the pointer away from the controls, it moves on by itself. */
  await page.mouse.move(600, 300)
  await show.getByRole('button', { name: 'Previous picture' }).blur()
  const moved = await page.waitForFunction(() => /02/.test(document.querySelector('.marquee__count')?.textContent ?? ''), null, { timeout: 9000 }).then(() => true, () => false)
  report.check('Left alone, it moves to the next picture', moved)

  await show.getByRole('button', { name: 'Pause the slideshow' }).click()
  await page.mouse.move(600, 300)
  const held = await number()
  await page.waitForTimeout(7500)
  report.check('Paused, it stays where it is', (await number()) === held, `${held} then ${await number()}`)
  report.check('No errors', errors.length === 0, errors.join(' | '))
  await context.close()

  /* With reduced motion requested it never moves by itself, and the pause button has nothing to do. */
  const still = await open({ width: 1440, height: 900 }, { reducedMotion: 'reduce' })
  await still.page.goto(base + '/', { waitUntil: 'networkidle' })
  await still.page.waitForTimeout(7500)
  report.check('With reduced motion it does not move by itself', /01/.test((await still.page.locator('.marquee__count').textContent()) ?? ''))
  report.check('Its pictures can still be changed by hand', await still.page.getByRole('button', { name: 'Next picture' }).isVisible())
  report.check('No video plays for the logo', (await still.page.locator('.game-logo video').count()) === 0)
  await still.context.close()

  /* A phone: the picture has its own frame, a swipe changes it, and no video is fetched for the logo. */
  const phone = await open({ width: 375, height: 812 }, { hasTouch: true, isMobile: true })
  const films = []
  phone.page.on('request', (request) => request.url().endsWith('.webm') && films.push(request.url()))
  await phone.page.goto(base + '/', { waitUntil: 'networkidle' })
  const frame = await phone.page.locator('.marquee__art').boundingBox()
  const words = await phone.page.locator('.showcase__motto').boundingBox()
  report.check('On a phone the words sit below the picture', Boolean(frame && words && words.y >= frame.y + frame.height - 40))
  report.check('On a phone the logo is a still picture', films.length === 0, films.join(', '))
  await phone.page.locator('.marquee__drum').tap()
  report.check('Tapping the drum changes the picture', /02/.test((await phone.page.locator('.marquee__count').textContent()) ?? ''))
  await phone.page.waitForTimeout(1300)
  const poster = await phone.page.locator('.marquee__card[data-place="top"]').boundingBox()
  report.check('On a phone the poster fits inside the picture frame', Boolean(poster && frame && poster.x >= -2 && poster.x + poster.width <= 377 && poster.y >= frame.y && poster.y + poster.height <= frame.y + frame.height + 2), poster ? `${Math.round(poster.x)} to ${Math.round(poster.x + poster.width)}px` : 'not found')
  await phone.context.close()

  /* The loader shows the game's logo. */
  const html = await (await fetch(base + '/')).text()
  report.check('The loader shows the Sheriff Town VR logo', html.includes('boot__logo') && html.includes('/media/stv-logo-480.webp'))
  const logo = await fetch(base + '/media/stv-logo-480.webp')
  const film = await fetch(base + '/media/stv-logo-reveal.webm', { method: 'HEAD' })
  report.check('The logo and its reveal animation are published', logo.ok && film.ok)
})

await run('The Praamix logo', async () => {
  const { context, page, errors } = await open({ width: 1440, height: 900 })
  await page.goto(base + '/services', { waitUntil: 'networkidle' })
  const home = page.locator('.site-header__home')
  const mark = home.locator('.wordmark')
  report.check('The header logo is the name with two game pieces', (await mark.textContent()) === 'PRMIX' && (await mark.locator('.piece').count()) === 2)
  report.check('The link around it is named in words', (await home.getAttribute('aria-label')) === 'Praamix home' && (await mark.getAttribute('aria-hidden')) === 'true')
  const colours = await mark.locator('.piece').evaluateAll((items) => items.map((item) => getComputedStyle(item).fill))
  report.check('One piece is white and one orange', colours[0] === 'rgb(243, 245, 247)' && colours[1] === 'rgb(242, 107, 56)', colours.join(' / '))
  const heights = await mark.evaluate((el) => {
    const piece = el.querySelector('.piece').getBoundingClientRect()
    const range = document.createRange()
    range.selectNodeContents(el.querySelector('span'))
    return { piece: piece.height, line: range.getBoundingClientRect().bottom, foot: piece.bottom, size: parseFloat(getComputedStyle(el).fontSize) }
  })
  report.check('The pieces stand about as tall as the capitals', Math.abs(heights.piece / heights.size - 0.76) < 0.03, `${(heights.piece / heights.size).toFixed(2)} of the type size`)
  report.check('The letters are not underlined', (await home.evaluate((el) => getComputedStyle(el).textDecorationLine)) === 'none')

  /* Each page opened is a move: a piece jumps. */
  await page.waitForTimeout(1600)
  await page.locator('.site-nav__link', { hasText: 'Studio' }).click()
  await page.waitForURL('**/studio')
  const moving = await page.waitForFunction(() => document.querySelector('.site-header__home .piece')?.getAnimations().length > 0, null, { timeout: 2000 }).then(() => true, () => false)
  report.check('Opening another page makes a piece jump', moving)

  /* Each person has a piece, and pointing at a profile makes theirs jump. */
  const pieces = page.locator('.profile .profile__piece .piece')
  report.check('Each profile carries a piece', (await pieces.count()) === 2 && (await pieces.nth(0).getAttribute('class'))?.includes('piece--1') === true && (await pieces.nth(1).getAttribute('class'))?.includes('piece--2') === true)
  await page.waitForTimeout(1200)
  await page.locator('.profile').nth(1).scrollIntoViewIfNeeded()
  await page.locator('.profile').nth(1).hover()
  const nudged = await page.waitForFunction(() => document.querySelectorAll('.site-header__home .piece')[1]?.getAnimations().length > 0, null, { timeout: 2000 }).then(() => true, () => false)
  report.check('Pointing at the second profile makes the orange piece jump', nudged)

  /* The cheat code. */
  const message = page.locator('.cheat')
  report.check('The cheat message is empty until earned', (await message.textContent()) === '')
  for (const key of ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']) await page.keyboard.press(key)
  report.check('The old cheat code is answered', /Cheat code accepted/.test((await message.textContent()) ?? ''))

  await page.goto(base + '/no-such-page', { waitUntil: 'networkidle' })
  report.check('On the not-found page a piece is knocked over', (await page.locator('main .wordmark[data-fallen]').count()) === 1)
  report.check('No errors', errors.length === 0, errors.join(' | '))
  await context.close()

  const still = await open({ width: 1440, height: 900 }, { reducedMotion: 'reduce' })
  await still.page.goto(base + '/services', { waitUntil: 'networkidle' })
  await still.page.locator('.site-nav__link', { hasText: 'Studio' }).click()
  await still.page.waitForURL('**/studio')
  await still.page.waitForTimeout(300)
  report.check('With reduced motion the pieces stay still', (await still.page.evaluate(() => [...document.querySelectorAll('.site-header__home .piece')].every((piece) => piece.getAnimations().length === 0))))
  await still.context.close()

  const html = await (await fetch(base + '/')).text()
  report.check('The loader carries the Praamix logo', html.includes('class="boot__name" aria-label="Praamix"'))
  const icon = await fetch(base + '/favicon.png')
  report.check('The browser tab icon is published', icon.ok)
})

await run('3D showroom and multiplayer', async () => {
  const { context, page } = await open({ width: 1440, height: 900 })
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  const room = page.locator('.showroom')
  await room.scrollIntoViewIfNeeded()
  const name = room.locator('.showroom__name')
  const first = await name.textContent()
  await room.getByRole('button', { name: 'Next' }).click()
  report.check('Next shows the next tool gun', (await name.textContent()) !== first)
  await room.getByRole('button', { name: 'Portal Gun' }).click()
  report.check('The picker chooses a gun by name', (await name.textContent()) === 'Portal Gun')
  const picks = await room.locator('.showroom__pick').count()
  report.check('The picker lists fourteen guns', picks === 14, `${picks} found`)
  const tools = await room.locator('.showroom__tool-list li').count()
  report.check('Eight physics tools are shown', tools === 8, `${tools} found`)
  await page.waitForTimeout(2500)
  const state = await room.locator('.showroom__stage').getAttribute('data-state')
  report.check('The stage shows the live model, or its picture where 3D is unavailable', ['ready', 'failed'].includes(state ?? ''), state ?? 'none')
  report.note(state === 'ready' ? 'Real-time 3D ran in this browser.' : 'This browser had no 3D, so the picture stood in.')
  const models = await page.evaluate(async () => {
    const answers = await Promise.all(['gun-spawn.glb', 'gun-portal.glb', 'gun-portal-albedo.webp'].map((file) => fetch('/models/' + file, { method: 'HEAD' })))
    return answers.every((answer) => answer.ok)
  })
  report.check('The model files are published', models)
  const heading = page.locator('#multiplayer-title')
  await heading.scrollIntoViewIfNeeded()
  report.check('Multiplayer is shown as planned', (await page.locator('#multiplayer .pill').textContent()) === 'Planned')
  await context.close()
})

await run('Night theme', async () => {
  const { context, page } = await open({ width: 1440, height: 900 })
  const dark = async () => page.evaluate(() => document.documentElement.classList.contains('night'))
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  report.check('The homepage is dark', await dark())
  await page.goto(base + '/games/sheriff-town-vr', { waitUntil: 'networkidle' })
  report.check('The game page is dark', await dark())
  await page.goto(base + '/services', { waitUntil: 'networkidle' })
  report.check('The services page is dark', await dark())
  await page.goto(base + '/studio', { waitUntil: 'networkidle' })
  report.check('The studio page is dark', await dark())
  await page.goto(base + '/contact', { waitUntil: 'networkidle' })
  report.check('The contact page is dark', await dark())
  const field = await page.locator('#brief-name').evaluate((el) => getComputedStyle(el).backgroundColor)
  report.check('Its form fields are dark too', field !== 'rgb(255, 255, 255)', field)
  await page.goto(base + '/privacy-policy', { waitUntil: 'networkidle' })
  report.check('The legal pages are dark', await dark())
  await page.locator('.site-nav__link', { hasText: 'Games' }).click()
  await page.waitForURL('**/games/**')
  report.check('Moving between pages stays dark', await dark())
  await context.close()
})

await run('Services and studio', async () => {
  const { context, page } = await open({ width: 1440, height: 900 })
  await page.goto(base + '/services', { waitUntil: 'networkidle' })

  const looks = page.locator('.asset__look')
  const stage = page.locator('.asset__stage')
  await page.waitForTimeout(2500)
  const state = await stage.getAttribute('data-state')
  if (state === 'ready') {
    await looks.nth(2).click()
    report.check('The asset can be shown finished', (await stage.getAttribute('data-look')) === 'final')
    await looks.nth(0).click()
    report.check('The asset can be shown as a wireframe', (await stage.getAttribute('data-look')) === 'wire')
  } else {
    report.check('Without 3D the asset falls back to its picture', state === 'failed', state ?? 'none')
  }

  const track = page.locator('.track')
  const stops = track.getByRole('tab')
  const title = track.locator('.track__title')
  const count = await stops.count()
  report.check('The track has nine stages', count === 9, `${count} found`)
  const first = await title.textContent()
  await stops.nth(0).focus()
  await page.keyboard.press('ArrowRight')
  report.check('Arrow key moves to the next stage', (await stops.nth(1).getAttribute('aria-selected')) === 'true')
  report.check('The stage text changes with it', (await title.textContent()) !== first)
  await track.getByRole('button', { name: 'Next stage' }).click()
  report.check('Next stage moves along the track', (await stops.nth(2).getAttribute('aria-selected')) === 'true')
  await page.keyboard.press('End')
  await stops.nth(8).click()
  report.check('Next is switched off at the last stage', await track.getByRole('button', { name: 'Next stage' }).isDisabled())

  await page.goto(base + '/studio', { waitUntil: 'networkidle' })
  const doors = page.locator('.door')
  report.check('The studio opens on two doors', (await doors.count()) === 2)
  report.check('One door leads to the game', (await doors.nth(0).getAttribute('href')) === '/games/sheriff-town-vr')
  report.check('The other leads to services', (await doors.nth(1).getAttribute('href')) === '/services')
  const portfolios = page.locator('.profile a[target="_blank"]')
  report.check('Both profiles link to a portfolio', (await portfolios.count()) === 2)
  await context.close()
})

await run('Trailer and the game’s channels', async () => {
  const { context, page, errors } = await open({ width: 1440, height: 900 })
  /* YouTube is stood in for here, so the check needs no connection and plays nothing. */
  const outside = []
  await context.route(/youtube|ytimg|googlevideo|doubleclick|discord/, (route) => {
    outside.push(route.request().url())
    return route.fulfill({ contentType: 'text/html', body: '<title>stand-in</title>' })
  })

  for (const path of ['/', '/games/sheriff-town-vr']) {
    outside.length = 0
    await page.goto(base + path, { waitUntil: 'networkidle' })
    await settle(page)
    report.check(`${path} loads nothing from YouTube or Discord by itself`, outside.length === 0, outside.slice(0, 2).join(', '))
    report.check(`${path} has no player on the page before play is pressed`, (await page.locator('iframe').count()) === 0)

    const play = page.locator('.trailer__play')
    await play.scrollIntoViewIfNeeded()
    await play.click()
    const player = page.locator('dialog.viewer--video')
    await player.waitFor({ state: 'visible', timeout: 5000 }).catch(() => undefined)
    const source = await player.locator('iframe').getAttribute('src').catch(() => null)
    report.check(`${path} pressing play opens the trailer`, /^https:\/\/www\.youtube-nocookie\.com\/embed\/[\w-]{11}\?/.test(source ?? ''), source ?? 'no player')
    await page.keyboard.press('Escape')
    await player.waitFor({ state: 'detached', timeout: 5000 }).catch(() => undefined)
    report.check(`${path} closing it takes the player off the page`, (await page.locator('iframe').count()) === 0)
    report.check(`${path} focus returns to the play button`, await play.evaluate((el) => el === document.activeElement))

    const hero = page.locator('.marquee .play-link, .showcase .play-link')
    await hero.scrollIntoViewIfNeeded()
    await hero.click()
    await player.waitFor({ state: 'visible', timeout: 5000 }).catch(() => undefined)
    report.check(`${path} the opening has a play button too`, await player.isVisible())
    await player.getByRole('button', { name: 'Close' }).click()
    await player.waitFor({ state: 'detached', timeout: 5000 }).catch(() => undefined)

    const channels = await page.locator('.channel').evaluateAll((items) => items.map((item) => item.href))
    report.check(
      `${path} links to the game’s Discord and YouTube`,
      channels.some((href) => href.startsWith('https://discord.gg/')) && channels.some((href) => href.startsWith('https://www.youtube.com/@')),
      channels.join(', '),
    )
  }

  const footer = await page.locator('footer a[target="_blank"]').evaluateAll((items) => items.map((item) => item.textContent?.trim().split(' ')[0]))
  report.check('The footer links to YouTube and Discord', footer.includes('YouTube') && footer.includes('Discord'), footer.join(', '))
  report.check('No errors', errors.length === 0, errors.join(' | '))
  await context.close()

  /* On a phone the trailer picture must hold its words and its button without either covering the other. */
  const phone = await open({ width: 320, height: 640 }, { hasTouch: true, isMobile: true })
  await phone.page.goto(base + '/', { waitUntil: 'networkidle' })
  const clear = await phone.page.evaluate(() => {
    const disc = document.querySelector('.trailer__label').getBoundingClientRect()
    const text = document.querySelector('.trailer__text').getBoundingClientRect()
    return disc.bottom <= text.top + 1
  })
  report.check('At 320px the play button sits clear of the words', clear)
  await phone.context.close()
})

await run('Loading, slow connections and offline', async () => {
  const pause = (ms) => new Promise((done) => setTimeout(done, ms))

  /* The loader is in the page's own HTML, so it needs no code to show. */
  const html = await (await fetch(base + '/')).text()
  report.check('The loader is part of the page before any code runs', html.includes('id="boot"'))
  report.check('Pages are dark from the first byte', html.includes('<html lang="en" class="night"'))

  /* A slow connection: hold the site's main code back for two seconds. */
  {
    const { context, page } = await open({ width: 1440, height: 900 })
    await page.route('**/assets/index-*.js', async (route) => {
      await pause(2000)
      await route.continue()
    })
    const loading = page.goto(base + '/', { waitUntil: 'load' })
    await pause(1200)
    const seen = await page.evaluate(() => {
      const boot = document.getElementById('boot')
      return boot ? Number(getComputedStyle(boot).opacity) : -1
    })
    report.check('On a slow connection the loader is showing', seen > 0.5, `opacity ${seen}`)
    await loading
    await page.waitForSelector('#boot', { state: 'detached', timeout: 8000 })
    report.check('The loader leaves once the page is on screen', true)
    await context.close()
  }

  /* The code never arrives. */
  {
    const { context, page } = await open({ width: 1440, height: 900 })
    await page.route('**/assets/index-*.js', (route) => route.abort())
    await page.goto(base + '/', { waitUntil: 'domcontentloaded' })
    const retry = page.locator('#boot-retry')
    await retry.waitFor({ state: 'visible', timeout: 8000 }).catch(() => undefined)
    report.check('If the code cannot load, the loader says so and offers to try again', await retry.isVisible())
    await context.close()
  }

  /* Once loaded, the loader is taken away. A page that then fails to arrive must say so. */
  {
    /* The saved offline copies are switched off here, so the failed download below really fails. */
    const { context, page } = await open({ width: 1440, height: 900 }, { serviceWorkers: 'block' })
    await page.goto(base + '/contact', { waitUntil: 'networkidle' })
    const gone = await page.waitForSelector('#boot', { state: 'detached', timeout: 5000 }).then(() => true, () => false)
    report.check('After loading, the loader is gone', gone)

    /* One page fails to arrive while moving between pages. */
    await page.route('**/assets/Services-*.js', (route) => route.abort())
    await page.locator('.site-nav__link', { hasText: 'Services' }).click()
    const failed = page.getByRole('heading', { name: 'This page didn’t arrive.' })
    await failed.waitFor({ state: 'visible', timeout: 8000 }).catch(() => undefined)
    report.check('A page that fails to load offers to try again', await failed.isVisible())
    await context.close()
  }

  /* Offline: after one visit, pages still open with no connection. */
  {
    const { context, page } = await open({ width: 1440, height: 900 })
    await page.goto(base + '/', { waitUntil: 'networkidle' })
    const controlled = await page
      .waitForFunction(() => navigator.serviceWorker?.controller != null, null, { timeout: 15000 })
      .then(() => true, () => false)
    report.check('The site saves itself for offline use on the first visit', controlled)
    if (controlled) {
      await pause(1500)
      await context.setOffline(true)
      await page.goto(base + '/', { waitUntil: 'domcontentloaded' })
      const home = page.getByRole('heading', { level: 1 })
      await home.waitFor({ state: 'visible', timeout: 10000 }).catch(() => undefined)
      report.check('The homepage opens with no connection', await home.isVisible())
      await page.goto(base + '/studio', { waitUntil: 'domcontentloaded' })
      const studio = page.getByRole('heading', { level: 1 })
      await studio.waitFor({ state: 'visible', timeout: 10000 }).catch(() => undefined)
      report.check('A page never opened before also opens offline', /We make games/.test((await studio.textContent().catch(() => '')) ?? ''))
      const notice = page.locator('.network-notice[data-shown]')
      report.check('An offline note is shown', (await notice.count()) === 1)
      await context.setOffline(false)
    }
    await context.close()
  }

  /* Data saver: the 3D model waits to be asked for. */
  {
    const { context, page } = await open({ width: 1440, height: 900 })
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'connection', { value: { saveData: true, effectiveType: '4g' }, configurable: true })
    })
    const models = []
    page.on('request', (request) => request.url().includes('/models/') && models.push(request.url()))
    await page.goto(base + '/', { waitUntil: 'networkidle' })
    const room = page.locator('.showroom')
    await room.scrollIntoViewIfNeeded()
    await pause(1500)
    const ask = room.getByRole('button', { name: /Load the 3D model/ })
    report.check('With data saver on, 3D waits to be asked for', (await ask.isVisible()) && models.length === 0, `${models.length} model requests`)
    await ask.click()
    await pause(2500)
    report.check('Asking for it loads the model', models.length > 0, `${models.length} model requests`)
    await context.close()
  }
})

await run('Portfolios on the same address', async () => {
  /* The saved offline copies are switched off, so every answer here comes from the server. */
  const { context, page } = await open({ width: 1440, height: 900 }, { serviceWorkers: 'block' })
  const failed = []
  page.on('requestfailed', (request) => request.url().startsWith(base) && failed.push(request.url().replace(base, '')))
  page.on('response', (response) => response.url().startsWith(base) && response.status() >= 400 && failed.push(`${response.status()} ${response.url().replace(base, '')}`))

  await page.goto(base + '/prashant', { waitUntil: 'load' })
  report.check('/prashant goes to /prashant/', new URL(page.url()).pathname === '/prashant/', new URL(page.url()).pathname)
  report.check('It shows Prashant\u2019s own page, not the studio site', /Prashant Gupta/.test(await page.title()), await page.title())
  await page.waitForLoadState('networkidle').catch(() => undefined)
  report.check('Its own files all load', failed.length === 0, failed.slice(0, 4).join(', '))

  failed.length = 0
  await page.goto(base + '/aman/', { waitUntil: 'load' })
  report.check('/aman/ shows Aman\u2019s own page', /Aman Yadav/.test(await page.title()), await page.title())
  await page.waitForLoadState('networkidle').catch(() => undefined)
  report.check('Its own files all load', failed.length === 0, failed.slice(0, 4).join(', '))

  const cv = await page.goto(base + '/aman/cv', { waitUntil: 'load' })
  report.check('/aman/cv opens without .html', cv?.ok() === true && new URL(page.url()).pathname.startsWith('/aman/cv'))

  await page.goto(base + '/studio', { waitUntil: 'networkidle' })
  const links = await page.locator('.profile a[target="_blank"]').evaluateAll((items) => items.map((item) => item.getAttribute('href')))
  report.check('The studio page links to both', links.includes('/prashant/') && links.includes('/aman/'), links.join(', '))

  const sitemap = await (await fetch(base + '/sitemap.xml')).text()
  report.check('The sitemap lists the studio pages and both portfolios', sitemap.includes('/services<') && sitemap.includes('/prashant/<') && sitemap.includes('/aman/<'))
  await context.close()
})

await run('Project brief', async () => {
  const { context, page } = await open({ width: 375, height: 812 })
  await page.goto(base + '/contact', { waitUntil: 'networkidle' })
  await page.fill('#brief-name', 'Test Person')
  await page.locator('form.brief button[type="submit"]').click()
  const alert = page.getByRole('alert')
  report.check('Submitting with missing answers lists the problems', await alert.isVisible())
  report.check('Typed answers are kept after an error', (await page.inputValue('#brief-name')) === 'Test Person')
  report.check('The error summary receives focus', await alert.evaluate((el) => el === document.activeElement))
  await page.fill('#brief-email', 'test@example.com')
  await page.fill('#brief-summary', 'A small physics puzzle game for phones.')
  await page.locator('form.brief button[type="submit"]').click()
  const status = await page.locator('.brief__status').getAttribute('data-kind')
  report.check('A complete brief gives a truthful result', ['checked', 'sent', 'mail', 'failed'].includes(status ?? ''), status ?? 'none')
  report.check('Answers stay in the form afterwards', (await page.inputValue('#brief-email')) === 'test@example.com')
  report.check('Privacy Policy is linked beside the form', await page.locator('.brief__note a[href="/privacy-policy"]').isVisible())
  await page.getByLabel('Mobile').check({ force: true })
  await page.getByLabel('Unity', { exact: true }).check({ force: true })
  const file = await page.locator('.file__rows').textContent()
  report.check('The project file fills in as answers are given', /Mobile/.test(file ?? '') && /Unity/.test(file ?? '') && /Test Person/.test(file ?? ''))
  await context.close()
})

await run('Delivering a project brief', async () => {
  /* The code Cloudflare runs, run here with a stand-in for the email service. */
  const { default: worker } = await import('../worker/index.js')
  const sent = []
  const env = (over = {}) => ({
    EMAIL: { send: async (message) => sent.push(message) },
    BRIEF_TO: 'studio@example.com',
    BRIEF_FROM: 'website@praamix.com',
    ASSETS: { fetch: async () => new Response('not found', { status: 404 }) },
    ...over,
  })
  const brief = { name: 'Test Person', email: 'test@example.com', company: '', summary: 'A small physics puzzle game for phones.', gameType: '', platforms: 'Mobile', engine: 'Unity', budget: '', timeframe: '', website: '', elapsed: 9000 }
  const post = (body, headers = {}) =>
    new Request('https://praamix.com/api/brief', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://praamix.com', ...headers }, body: JSON.stringify(body) })
  const status = async (request, with_ = env()) => (await worker.fetch(request, with_)).status

  report.check('A good brief is emailed', (await status(post(brief))) === 200 && sent.length === 1)
  const mail = sent[0] ?? {}
  report.check('It goes to the studio, from the site’s own address', mail.to === 'studio@example.com' && mail.from?.email === 'website@praamix.com')
  report.check('Replying to it replies to the visitor', mail.replyTo?.email === 'test@example.com')
  report.check('It carries the answers', /Test Person/.test(mail.text ?? '') && /physics puzzle/.test(mail.text ?? '') && /Unity/.test(mail.text ?? ''))

  sent.length = 0
  await status(post({ ...brief, name: 'Eve\r\nBcc: everyone@example.com' }))
  report.check('A visitor’s words cannot add lines to the email’s headers', !/[\r\n]/.test(sent[0]?.subject ?? '\n') && sent[0]?.to === 'studio@example.com')

  sent.length = 0
  report.check('A page on another site cannot use it', (await status(post(brief, { Origin: 'https://elsewhere.example' }))) === 403)
  report.check('A bad email address is refused', (await status(post({ ...brief, email: 'nope' }))) === 400)
  report.check('An oversized brief is refused', (await status(post({ ...brief, summary: 'x'.repeat(30000) }))) === 413)
  report.check('Only a POST is accepted', (await status(new Request('https://praamix.com/api/brief'))) === 405)
  report.check('None of those sent an email', sent.length === 0)

  const trapped = await status(post({ ...brief, website: 'https://spam.example' }))
  const rushed = await status(post({ ...brief, elapsed: 200 }))
  report.check('A robot is told "sent" and nothing is sent', trapped === 200 && rushed === 200 && sent.length === 0)

  report.check('Before the inbox is set up it says so, and does not pretend', (await status(post(brief), env({ BRIEF_TO: undefined }))) === 503)
  const broken = env({ EMAIL: { send: async () => Promise.reject(Object.assign(new Error('refused'), { code: 'E_SENDER_NOT_VERIFIED' })) } })
  const quiet = console.error
  console.error = () => undefined
  const failed = await status(post(brief), broken)
  console.error = quiet
  report.check('If the email cannot be sent, the form is told it failed', failed === 502)
  report.check('Other addresses under /api/ are not found', (await status(new Request('https://praamix.com/api/else'))) === 404)

  /* The form itself: the hidden field is out of sight and out of the tab order, and travels with the brief. */
  const { context, page } = await open({ width: 1024, height: 768 })
  await page.goto(base + '/contact', { waitUntil: 'networkidle' })
  const trap = page.locator('.brief__trap input')
  const box = await trap.boundingBox()
  report.check('The field for robots is out of sight', Boolean(box && box.x + box.width < 0))
  report.check('It is skipped by the keyboard and by screen readers', (await trap.getAttribute('tabindex')) === '-1' && (await page.locator('.brief__trap').getAttribute('aria-hidden')) === 'true')
  await context.close()
})

await run('Player support', async () => {
  const { context, page, errors } = await open({ width: 1440, height: 900 })
  await page.goto(base + '/support', { waitUntil: 'networkidle' })
  report.check('The support page has its own heading', (await page.getByRole('heading', { level: 1 }).textContent()) === 'Player support.')
  const ways = await page.locator('main .channel').evaluateAll((items) => items.map((item) => item.getAttribute('href')))
  report.check('It offers email and Discord', ways.some((href) => href?.startsWith('mailto:hello@praamix.com')) && ways.some((href) => href?.startsWith('https://discord.gg/')), ways.join(', '))
  const questions = page.locator('.faq__item')
  report.check('It answers common questions', (await questions.count()) >= 8, `${await questions.count()} questions`)
  await questions.first().locator('summary').click()
  report.check('A question opens to show its answer', await questions.first().evaluate((el) => el.open))
  report.check('It links to the game’s privacy policy', (await page.locator('main a[href="/games/sheriff-town-vr/privacy-policy"]').count()) === 1)
  report.check('The footer links to it', await page.locator('footer').getByRole('link', { name: 'Player support' }).isVisible())
  const direct = await fetch(base + '/support')
  report.check('Its address answers directly', direct.status === 200 && !direct.redirected)
  report.check('No errors', errors.length === 0, errors.join(' | '))
  await context.close()
})

await run('Legal pages', async () => {
  const { context, page } = await open({ width: 1440, height: 900 })
  for (const path of ['/terms-and-conditions', '/privacy-policy', '/games/sheriff-town-vr/privacy-policy']) {
    await page.goto(base + path, { waitUntil: 'networkidle' })
    const links = page.locator('.legal__contents a')
    const count = await links.count()
    const broken = await page.evaluate(() =>
      [...document.querySelectorAll('.legal__contents a')].filter(
        (a) => !document.getElementById(new URL(a.href).hash.slice(1)),
      ).length,
    )
    await links.last().click()
    const target = new URL(await links.last().evaluate((a) => a.href)).hash.slice(1)
    const focused = await page.evaluate(() => document.activeElement?.id ?? '')
    report.check(`${path} contents links all lead somewhere`, count > 0 && broken === 0, `${count} links, ${broken} broken`)
    report.check(`${path} following a contents link moves focus to that section`, focused === target, focused)
  }
  await page.goto(base + '/games/sheriff-town-vr/privacy-policy', { waitUntil: 'networkidle' })
  const policy = page.getByRole('heading', { level: 1 })
  report.check('The game has its own privacy policy page', (await policy.textContent()) === 'Privacy Policy' && /Sheriff Town VR/.test((await page.locator('.legal__head .eyebrow').textContent()) ?? ''))
  report.check('It is final, not marked as a draft', (await page.locator('.legal__head .notice').count()) === 0 && (await page.locator('.pending').count()) === 0)
  report.check('It gives a contact address', /hello@praamix\.com/.test((await page.locator('main').textContent()) ?? ''))
  const direct = await fetch(base + '/games/sheriff-town-vr/privacy-policy')
  report.check('Its address answers directly, without a redirect', direct.status === 200 && !direct.redirected && /Privacy Policy/.test(await direct.text()))
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  for (const label of ['Terms & Conditions', 'Privacy Policy', 'Sheriff Town VR Privacy']) {
    report.check(`Footer links to ${label}`, await page.locator('footer').getByRole('link', { name: label }).isVisible())
  }
  await context.close()
})

await run('Reduced motion', async () => {
  const { context, page, errors } = await open({ width: 1440, height: 900 }, { reducedMotion: 'reduce' })
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await page.mouse.move(1000, 400)
  const moving = await page.evaluate(() =>
    [...document.querySelectorAll('*')].some((el) => {
      const style = getComputedStyle(el)
      return style.animationName !== 'none' && parseFloat(style.animationDuration) > 0.01
    }),
  )
  report.check('Nothing animates when reduced motion is requested', !moving)
  report.check('No errors', errors.length === 0, errors.join(' | '))
  await context.close()
})

await run('Direct loading and the not-found page', async () => {
  const { context, page } = await open({ width: 1024, height: 768 })
  for (const path of paths) {
    const response = await page.goto(base + path, { waitUntil: 'networkidle' })
    const title = await page.title()
    report.check(`${path} loads directly`, response?.ok() === true && title.length > 0, `${response?.status()} "${title}"`)
  }
  await page.goto(base + '/no-such-page', { waitUntil: 'networkidle' })
  report.check('An unknown address shows the not-found page', /not found/i.test(await page.title()))
  await context.close()
})

await run('Transfer size of the first screen on a phone', async () => {
  const { context, page } = await open({ width: 375, height: 812 }, { isMobile: true, deviceScaleFactor: 2 })
  let bytes = 0
  const sizes = {}
  page.on('response', async (response) => {
    const length = await response.body().then((body) => body.length, () => 0)
    const kind = response.request().resourceType()
    bytes += length
    sizes[kind] = (sizes[kind] ?? 0) + length
  })
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  const kb = (n) => `${Math.round(n / 1024)} KB`
  report.note(`Home page at 375px, 2x screen, before scrolling: ${kb(bytes)} (uncompressed; a host that compresses sends less)`)
  report.note(Object.entries(sizes).map(([kind, n]) => `${kind} ${kb(n)}`).join(', '))
  report.check('Under 1 MB before scrolling', bytes < 1024 * 1024)
  await context.close()
})

await site.close()
await browser.close()

report.section(`${report.passed} passed, ${report.failed} failed`)
await writeFile(join(work, 'report.txt'), report.text())
process.exit(report.failed > 0 ? 1 : 0)
