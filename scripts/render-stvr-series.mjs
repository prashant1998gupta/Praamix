/*
 * Renders the 15 posters of the Sheriff Town VR LinkedIn series into
 * brand/linkedin/sheriff-town-vr-series/, plus captions.md with each day's
 * post text. The content is in scripts/stvr-series.mjs.
 *
 *   node scripts/render-stvr-series.mjs          all days
 *   node scripts/render-stvr-series.mjs 3 7      only days 3 and 7
 *
 * Posters are 1080 x 1350 (4:5), the tallest shape LinkedIn shows in full.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import { launchBrowser, root } from './checks/browser.mjs'
import { days, tags } from './stvr-series.mjs'

const out = path.join(root, 'brand/linkedin/sheriff-town-vr-series')
const file = (p) => pathToFileURL(path.join(root, p)).href
const poster = (n) => file(`media-source/game/posters/${n}.jpg`)
const shot = (n) => file(`media-source/game/${n}.png`)
const gun = (n) => file(`media-source/game/cutouts/gun-${n}.png`)
const font = file('node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2')
const logo = file('media-source/game/sheriff-town-logo.png')
const wordmark = (await readFile(path.join(root, 'brand/praamix-logo-for-dark-backgrounds.svg'), 'utf8'))
  .replace(/<title>.*?<\/title>/, '')
  .replace('<svg ', '<svg class="wordmark" ')

const pad = (n) => String(n).padStart(2, '0')
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

const css = `
@font-face { font-family: Manrope; src: url('${font}') format('woff2'); font-weight: 200 800; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1080px; height: 1350px; overflow: hidden; position: relative; font-family: Manrope, sans-serif; color: #fff; background: #0b0e12; }
.o { color: #f26b38; }
.noise { position: absolute; inset: 0; pointer-events: none; opacity: .5; background:
  repeating-linear-gradient(90deg, rgba(255,255,255,.025) 0 1px, transparent 1px 54px),
  repeating-linear-gradient(0deg, rgba(255,255,255,.025) 0 1px, transparent 1px 54px); }
.top { position: absolute; left: 56px; right: 56px; top: 44px; display: flex; align-items: center; justify-content: space-between; z-index: 10; }
.top img { height: 118px; filter: drop-shadow(0 6px 18px rgba(0,0,0,.55)); }
.daypill { display: flex; align-items: baseline; gap: 8px; padding: 14px 24px; border-radius: 999px; background: rgba(11,14,18,.72); border: 2px solid rgba(255,255,255,.18); backdrop-filter: blur(8px); font-weight: 800; letter-spacing: .12em; font-size: 22px; }
.daypill b { font-size: 40px; color: #f26b38; letter-spacing: 0; }
.daypill i { font-style: normal; color: rgba(255,255,255,.6); }
.foot { position: absolute; left: 56px; right: 56px; bottom: 40px; display: flex; align-items: center; justify-content: space-between; z-index: 10; font-size: 19px; font-weight: 600; color: rgba(255,255,255,.72); }
.foot .left { display: flex; align-items: center; gap: 18px; }
.wordmark { width: 150px; height: auto; }
.tag { font-size: 15px; letter-spacing: .12em; text-transform: uppercase; font-weight: 700; color: rgba(255,255,255,.62); border: 1.5px solid rgba(255,255,255,.22); padding: 6px 12px; border-radius: 6px; }
.eyebrow { font-size: 24px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: #f26b38; }
h1 { font-weight: 800; letter-spacing: -.035em; line-height: .95; text-shadow: 0 8px 30px rgba(0,0,0,.45); }
.hook { font-size: 34px; line-height: 1.3; font-weight: 600; color: rgba(255,255,255,.88); }
.chips { display: flex; flex-wrap: wrap; gap: 12px; }
.chips span { font-size: 22px; font-weight: 700; padding: 10px 20px; border-radius: 999px; background: rgba(255,255,255,.08); border: 1.5px solid rgba(255,255,255,.22); }
.chips span:first-child { background: #f26b38; border-color: #f26b38; color: #111; }
.art { position: absolute; left: 0; right: 0; top: 0; background-repeat: no-repeat; }
.art::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(11,14,18,.55) 0%, rgba(11,14,18,0) 22%, rgba(11,14,18,0) 55%, #0b0e12 100%); }
.stripe { position: absolute; left: 0; width: 12px; background: #f26b38; }
`

const top = (d) => `
<div class="top">
  <img src="${logo}" alt="">
  <div class="daypill">DAY <b>${pad(d.day)}</b><i>/ 15</i></div>
</div>`

// Sheriff Town VR comes out on Meta Quest on 1 December 2026 (src/content/game.ts).
const status = (d) => (d.date >= '2026-12-01' ? 'Out now on Meta Quest' : 'In development · Meta Quest &amp; PC VR')
const foot = (d) => `
<div class="foot">
  <div class="left">${wordmark}<span>${status(d)}</span></div>
  <span class="tag">${d.label || d.shotLabel}</span>
</div>`

const chips = (list) => (list ? `<div class="chips">${list.map((c) => `<span>${esc(c)}</span>`).join('')}</div>` : '')

const layouts = {
  hero: (d) => `
<style>
.art { height: 940px; background-image: url('${poster(d.art)}'); background-size: auto ${d.zoom}%; background-position: ${d.pos}; }
.copy { position: absolute; left: 56px; right: 56px; top: 770px; display: grid; gap: 22px; }
h1 { font-size: 132px; }
.inset { position: absolute; right: 56px; top: 520px; width: 330px; padding: 12px 12px 44px; background: #f4efe6; border-radius: 6px; transform: rotate(4deg); box-shadow: 0 24px 60px rgba(0,0,0,.6); z-index: 5; }
.inset div { height: 230px; background: url('${d.inset ? shot(d.inset) : ''}') center/cover; border-radius: 2px; }
.inset span { position: absolute; left: 0; right: 0; bottom: 12px; text-align: center; color: #333; font-size: 17px; font-weight: 700; letter-spacing: .06em; }
</style>
<div class="art"></div>
${d.inset ? `<div class="inset"><div></div><span>${d.insetLabel}</span></div>` : ''}
<div class="stripe" style="top:780px;height:180px"></div>
<div class="copy">
  <div class="eyebrow">${esc(d.eyebrow)}</div>
  <h1>${d.title[0]}<br>${d.title[1].replace(/\.$/, '<span class="o">.</span>')}</h1>
  <div class="hook">${esc(d.hook)}</div>
  ${chips(d.chips)}
</div>`,

  quote: (d) => `
<style>
.art { inset: 0; height: auto; background-image: url('${poster(d.art)}'); background-size: auto ${d.zoom}%; background-position: ${d.pos}; filter: saturate(1.15); }
.art::after { background: linear-gradient(180deg, rgba(11,14,18,.5) 0%, rgba(11,14,18,.2) 30%, rgba(11,14,18,.85) 62%, #0b0e12 100%); }
.bubble { position: absolute; left: 56px; right: 56px; top: 600px; padding: 56px 56px 50px; background: #fff; color: #111; border-radius: 40px; box-shadow: 0 30px 80px rgba(0,0,0,.55); }
.bubble::after { content: ''; position: absolute; left: 110px; bottom: -40px; border: 22px solid transparent; border-top: 30px solid #fff; border-left: 30px solid #fff; }
.bubble .mark { position: absolute; top: -70px; left: 40px; font-size: 220px; line-height: 1; font-weight: 800; color: #f26b38; }
.bubble p { font-size: 54px; line-height: 1.16; font-weight: 800; letter-spacing: -.02em; }
.who { position: absolute; left: 140px; top: 1170px; font-size: 28px; font-weight: 700; }
.who small { display: block; font-size: 20px; color: #f26b38; letter-spacing: .14em; text-transform: uppercase; margin-bottom: 4px; }
.lab { position: absolute; left: 56px; top: 520px; }
</style>
<div class="art"></div>
<div class="lab eyebrow">${esc(d.eyebrow)}</div>
<div class="bubble"><div class="mark">“</div><p>${esc(d.quote)}</p></div>
<div class="who"><small>Every line is voiced</small>${esc(d.who)}</div>`,

  gun: (d) => `
<style>
body { background: radial-gradient(70% 55% at 50% 42%, ${d.glow}55 0%, ${d.glow}18 40%, #0b0e12 75%); }
${d.glow2 ? `.glow2 { position: absolute; width: 520px; height: 520px; right: -120px; top: 280px; border-radius: 50%; background: radial-gradient(${d.glow2}55, transparent 65%); }
.glow1 { position: absolute; width: 520px; height: 520px; left: -140px; top: 220px; border-radius: 50%; background: radial-gradient(${d.glow}66, transparent 65%); }` : ''}
.ghost { position: absolute; left: -10px; right: -10px; top: 210px; text-align: center; font-size: 330px; font-weight: 800; letter-spacing: -.05em; line-height: .8; color: transparent; -webkit-text-stroke: 3px rgba(255,255,255,.09); white-space: nowrap; }
.gun { position: absolute; left: 50%; top: 210px; width: 860px; height: 560px; transform: translateX(-50%) rotate(-10deg); background: url('${gun(d.gun)}') center/contain no-repeat; filter: drop-shadow(0 40px 50px rgba(0,0,0,.6)) drop-shadow(0 0 70px ${d.glow}88); }
.floor { position: absolute; left: 50%; top: 760px; width: 620px; height: 60px; transform: translateX(-50%); background: radial-gradient(rgba(0,0,0,.55), transparent 70%); }
.copy { position: absolute; left: 56px; right: 56px; top: 820px; display: grid; gap: 18px; }
h1 { font-size: 120px; }
.specs { display: grid; gap: 10px; margin-top: 6px; }
.specs div { font-size: 26px; font-weight: 600; color: rgba(255,255,255,.86); padding-left: 34px; position: relative; }
.specs div::before { content: ''; position: absolute; left: 0; top: 11px; width: 16px; height: 16px; border-radius: 4px; background: ${d.glow}; transform: rotate(45deg); }
.strip { position: absolute; right: 56px; top: 860px; width: 270px; height: 340px; border-radius: 24px; background: url('${d.strip ? poster(d.strip) : ''}') ${d.stripPos || 'center'}/auto 160% no-repeat; border: 3px solid rgba(255,255,255,.18); box-shadow: 0 20px 50px rgba(0,0,0,.5); }
</style>
${d.glow2 ? '<div class="glow1"></div><div class="glow2"></div>' : ''}
<div class="ghost">${d.title.join(' ').toUpperCase()}</div>
<div class="floor"></div>
<div class="gun"></div>
${d.strip ? '<div class="strip"></div>' : ''}
<div class="copy" ${d.strip ? 'style="right:350px"' : ''}>
  <div class="eyebrow">${esc(d.eyebrow)}</div>
  <h1>${d.title[0]} <span class="o">${d.title[1]}</span></h1>
  <div class="hook">${esc(d.hook)}</div>
  <div class="specs">${d.specs.map((s) => `<div>${esc(s)}</div>`).join('')}</div>
</div>`,

  case: (d) => `
<style>
body { background: radial-gradient(90% 60% at 50% 30%, #1f1a14 0%, #0b0e12 70%); }
.folder { position: absolute; left: 48px; right: 48px; top: 210px; height: 1000px; background: linear-gradient(180deg, #e3c48c, #d6b06e); border-radius: 0 18px 18px 18px; box-shadow: 0 40px 90px rgba(0,0,0,.6); transform: rotate(-1.2deg); }
.folder::before { content: 'CASE FILE  #${d.file}'; position: absolute; left: 0; top: -58px; height: 60px; padding: 0 34px; display: flex; align-items: center; background: #e3c48c; border-radius: 16px 16px 0 0; color: #3a2a12; font: 800 26px/1 Manrope; letter-spacing: .16em; }
.photo { position: absolute; left: 60px; right: 60px; top: 60px; height: 400px; background: #fff; padding: 14px; box-shadow: 0 16px 34px rgba(0,0,0,.35); transform: rotate(1.5deg); }
.photo .shot { width: 100%; height: 100%; background: url('${d.shot ? shot(d.shot) : ''}') center/cover; filter: contrast(1.05) saturate(1.1); }
.photo span { position: absolute; left: 22px; bottom: 22px; background: rgba(0,0,0,.65); color: #fff; font: 700 16px Manrope; letter-spacing: .1em; text-transform: uppercase; padding: 6px 10px; border-radius: 4px; }
.tape { position: absolute; width: 150px; height: 40px; background: rgba(255,255,230,.6); top: -16px; z-index: 2; }
.status { position: absolute; left: 70px; right: 70px; bottom: 56px; padding-top: 22px; border-top: 3px dashed rgba(42,30,12,.35); display: flex; justify-content: space-between; color: #2a1e0c; font: 800 22px Manrope; letter-spacing: .12em; text-transform: uppercase; }
.status b { color: #c0291b; }
.typed { position: absolute; left: 70px; right: 70px; top: 500px; color: #2a1e0c; font-family: 'Courier New', monospace; }
.typed .where { font-size: 24px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; opacity: .75; }
.typed h1 { font-family: Manrope; color: #1a1209; font-size: 76px; text-shadow: none; margin: 10px 0 18px; }
.typed p { font-size: 27px; line-height: 1.38; font-weight: 700; }
.typed p + p { margin-top: 16px; font-style: italic; opacity: .85; }
.stamp { position: absolute; right: 34px; top: 26px; z-index: 3; padding: 10px 26px; border: 7px solid #c0291b; color: #c0291b; font: 800 58px/1 Manrope; letter-spacing: .1em; transform: rotate(-12deg); border-radius: 10px; opacity: .88; mix-blend-mode: multiply; }
</style>
<div class="folder">
  <div class="photo"><div class="tape" style="left:40px;transform:rotate(-8deg)"></div><div class="tape" style="right:40px;transform:rotate(7deg)"></div><div class="shot"></div><span>${d.shotLabel}</span></div>
  <div class="stamp">OPEN</div>
  <div class="typed">
    <div class="where">Location: ${esc(d.where)}</div>
    <h1>${esc(d.title)}</h1>
    <p>${esc(d.hook)}</p>
    <p>${esc(d.detail)}</p>
  </div>
  <div class="status"><span>Status: <b>Unsolved</b></span><span>Every witness is voiced</span></div>
</div>`,

  challenge: (d) => `
<style>
.art { height: 980px; background-image: url('${shot(d.shot)}'); background-size: cover; background-position: 50% 40%; filter: saturate(1.25) contrast(1.05); }
.hud { position: absolute; left: 56px; right: 56px; top: 220px; display: flex; justify-content: space-between; align-items: flex-start; }
.timer { padding: 18px 28px; border-radius: 20px; background: rgba(11,14,18,.75); border: 2px solid #f26b38; font: 800 84px/1 Manrope; letter-spacing: .02em; font-variant-numeric: tabular-nums; }
.timer small { display: block; font-size: 18px; letter-spacing: .2em; color: #f26b38; margin-bottom: 8px; }
.best { padding: 14px 22px; border-radius: 16px; background: rgba(11,14,18,.75); font-weight: 800; font-size: 22px; letter-spacing: .12em; }
.tiles { position: absolute; left: 56px; right: 56px; top: 760px; display: grid; grid-template-columns: repeat(8, 1fr); gap: 12px; transform: perspective(700px) rotateX(38deg); }
.tiles i { height: 74px; border-radius: 10px; box-shadow: 0 10px 24px rgba(0,0,0,.45), inset 0 -6px 0 rgba(0,0,0,.2); }
.copy { position: absolute; left: 56px; right: 56px; top: 880px; display: grid; gap: 16px; }
h1 { font-size: 100px; white-space: nowrap; }
</style>
<div class="art"></div>
<div class="hud"><div class="timer"><small>TIME</small>00:47.20</div><div class="best">BEST TIME KEPT</div></div>
<div class="tiles">${['#ff4d4d', '#ffb02e', '#ffe14d', '#3ddc84', '#2fc8ff', '#5b6bff', '#c45bff', '#ff6fb5'].map((c) => `<i style="background:${c}"></i>`).join('')}</div>
<div class="copy">
  <div class="eyebrow">${esc(d.eyebrow)}</div>
  <h1>${d.title[0]} <span class="o">${d.title[1]}</span></h1>
  <div class="hook">${esc(d.hook)}</div>
  ${chips(d.chips)}
</div>`,

  arsenal: (d) => {
    const list = ['spawn', 'physics', 'gravity', 'portal', 'ice', 'bubble', 'size', 'copypaste', 'food', 'scanner', 'joint', 'harpoon', 'connection', 'modification']
    const names = { copypaste: 'Copy-Paste' }
    return `
<style>
body { background: radial-gradient(80% 50% at 50% 50%, #26180f 0%, #0b0e12 70%); }
.copy { position: absolute; left: 56px; right: 56px; top: 210px; display: grid; gap: 14px; }
h1 { font-size: 88px; }
.grid { position: absolute; left: 48px; right: 48px; top: 470px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.grid div { height: 168px; border-radius: 20px; background: linear-gradient(160deg, rgba(255,255,255,.09), rgba(255,255,255,.02)); border: 1.5px solid rgba(255,255,255,.12); position: relative; }
.grid div i { position: absolute; inset: 10px 14px 38px; background-size: contain; background-position: center; background-repeat: no-repeat; filter: drop-shadow(0 10px 14px rgba(0,0,0,.5)); }
.grid div b { position: absolute; left: 0; right: 0; bottom: 10px; text-align: center; font-size: 19px; font-weight: 800; }
.grid div em { position: absolute; left: 12px; top: 8px; font-style: normal; font-size: 15px; font-weight: 800; color: #f26b38; }
.grid .cta { background: #f26b38; border: 0; color: #111; display: flex; flex-direction: column; justify-content: center; padding: 0 20px; grid-column: span 2; }
.grid .cta strong { font-size: 30px; line-height: 1.1; }
.grid .cta span { font-size: 19px; font-weight: 700; margin-top: 6px; }
</style>
<div class="copy">
  <div class="eyebrow">${esc(d.eyebrow)}</div>
  <h1>${d.title[0].replace('14', '<span class="o">14</span>')}<br>${d.title[1]}</h1>
</div>
<div class="grid">
  ${list.map((g, i) => `<div><em>${pad(i + 1)}</em><i style="background-image:url('${gun(g)}')"></i><b>${names[g] || g[0].toUpperCase() + g.slice(1)}</b></div>`).join('')}
  <div class="cta"><strong>The full breakdown</strong><span>praamix.com/devlog</span></div>
</div>`
  },
}

const only = process.argv.slice(2).map(Number)
const list = only.length ? days.filter((d) => only.includes(d.day)) : days

await mkdir(out, { recursive: true })
const { browser } = await launchBrowser(['--allow-file-access-from-files'])
for (const d of list) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 })
  const html = `<!doctype html><meta charset="utf-8"><style>${css}</style>${layouts[d.kind](d)}<div class="noise"></div>${top(d)}${foot(d)}`
  const tmp = path.join(out, `.day-${pad(d.day)}.html`)
  await writeFile(tmp, html)
  await page.goto(pathToFileURL(tmp).href)
  await page.evaluate(() => document.fonts.ready)
  await page.waitForLoadState('networkidle')
  await page.screenshot({ path: path.join(out, `day-${pad(d.day)}.png`) })
  await rm(tmp)
  await page.close()
  console.log(`day ${pad(d.day)} ${d.kind}`)
}
await browser.close()

const md = [
  '# Sheriff Town VR: 15 days on LinkedIn',
  '',
  'One post a day on the Praamix page, 7:00 PM India time. Images are in this folder; facts come from src/content/game.ts and src/content/devlog.ts.',
  '',
  ...days.flatMap((d) => [`## Day ${pad(d.day)} · ${d.date} · day-${pad(d.day)}.png`, '', '```', d.caption, '```', '']),
].join('\n')
await writeFile(path.join(out, 'captions.md'), md)
console.log('captions.md written', tags.length > 0)
