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
 * menu, the chapters, the project brief, reduced motion, direct loading of
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
    [...document.querySelectorAll('.btn, .menu-button, .chapters__tab')]
      .filter((el) => el.getBoundingClientRect().width > 0)
      .filter((el) => el.getBoundingClientRect().height < 44).length,
  )
  report.check('Buttons are at least 44px tall', targets === 0, `${targets} smaller`)
  await context.close()
})

await run('Chapters with keyboard and pointer', async () => {
  const { context, page } = await open({ width: 1440, height: 900 })
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  const tabs = page.getByRole('tab')
  const count = await tabs.count()
  report.check('There are three chapters', count === 3, `${count} found`)
  const heading = page.locator('.chapters__text h3')
  const first = await heading.textContent()
  await tabs.nth(0).focus()
  await page.keyboard.press('ArrowRight')
  report.check('Arrow key selects the next chapter', (await tabs.nth(1).getAttribute('aria-selected')) === 'true')
  report.check('The text changes with it', (await heading.textContent()) !== first)
  await page.keyboard.press('End')
  report.check('End selects the last chapter', (await tabs.nth(2).getAttribute('aria-selected')) === 'true')
  await tabs.nth(0).click()
  report.check('Clicking selects a chapter', (await tabs.nth(0).getAttribute('aria-selected')) === 'true')
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
  await context.close()
})

await run('Legal pages', async () => {
  const { context, page } = await open({ width: 1440, height: 900 })
  for (const path of ['/terms-and-conditions', '/privacy-policy']) {
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
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  for (const label of ['Terms & Conditions', 'Privacy Policy']) {
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
