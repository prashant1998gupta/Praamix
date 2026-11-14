/*
 * Measures how wide each capital letter and digit sets in the faces used for
 * game titles, and prints the table kept in src/components/titleMetrics.ts.
 *
 * Only needed again if the fonts or the title styles change:
 *   npm run build
 *   node scripts/measure-glyphs.mjs
 */
import { launchBrowser, serve } from './checks/browser.mjs'

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 &-:'.!?"
const FACES = {
  stacked: "font: 800 100px 'Archivo Display'; font-stretch: 75%",
  line: "font: 800 100px 'Archivo Display'; font-stretch: 100%",
  accent: "font: italic 400 100px 'Instrument Serif'",
}

const { browser, name } = await launchBrowser()
const site = await serve('dist', 4320)
const page = await browser.newPage()
await page.goto(site.url, { waitUntil: 'networkidle' })

const table = await page.evaluate(
  async ({ glyphs, faces }) => {
    await Promise.all([
      document.fonts.load("800 100px 'Archivo Display'"),
      document.fonts.load("italic 400 100px 'Instrument Serif'"),
    ])
    await document.fonts.ready

    const result = {}
    for (const [face, css] of Object.entries(faces)) {
      const span = document.createElement('span')
      span.style.cssText = `${css}; position: absolute; visibility: hidden; white-space: pre; font-kerning: none; letter-spacing: 0; text-transform: none`
      document.body.append(span)
      result[face] = [...glyphs].map((glyph) => {
        span.textContent = glyph.repeat(20)
        return Number((span.getBoundingClientRect().width / 2000).toFixed(3))
      })
      span.remove()
    }
    return result
  },
  { glyphs: GLYPHS, faces: FACES },
)

console.log(`Measured in ${name}\n`)
console.log(`const GLYPHS = ${JSON.stringify(GLYPHS)}\n`)
console.log('const WIDTHS = {')
for (const [face, widths] of Object.entries(table)) {
  console.log(`  ${face}: [${widths.join(', ')}],`)
}
console.log('}')

await browser.close()
await site.close()
