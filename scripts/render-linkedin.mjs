/*
 * Renders the images for the Praamix LinkedIn page into brand/linkedin/.
 *
 *   node scripts/render-linkedin.mjs
 *
 * Every image is drawn from HTML in an installed Chrome or Edge, with the
 * site's own font, colours, logo and Sheriff Town VR key art. The key art is
 * illustration, not in-game capture, and the posts say so.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import { launchBrowser, root } from './checks/browser.mjs'

const out = path.join(root, 'brand/linkedin')
const file = (p) => pathToFileURL(path.join(root, p)).href
const poster = (name) => file(`media-source/game/posters/${name}.jpg`)

const font = file('node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2')
const wordmark = (await readFile(path.join(root, 'brand/praamix-logo-for-dark-backgrounds.svg'), 'utf8'))
  .replace(/<title>.*?<\/title>/, '')
  .replace('<svg ', '<svg class="wordmark" ')
const pieces = (await readFile(path.join(root, 'brand/praamix-pieces-for-dark-backgrounds.svg'), 'utf8'))
  .replace(/<title>.*?<\/title>/, '')
  .replace('<svg ', '<svg class="pieces" ')

const base = `
@font-face { font-family: Manrope; src: url('${font}') format('woff2'); font-weight: 200 800; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 100%; height: 100%; }
body { font-family: Manrope, sans-serif; background: #0f1216; color: #fff; overflow: hidden; position: relative; }
.o { color: #f26b38; }
.grain { position: absolute; inset: 0; background:
  radial-gradient(120% 140% at 100% 0%, rgba(242,107,56,.18), transparent 55%),
  repeating-linear-gradient(90deg, rgba(255,255,255,.025) 0 1px, transparent 1px 48px),
  repeating-linear-gradient(0deg, rgba(255,255,255,.025) 0 1px, transparent 1px 48px); }
.panel { position: absolute; background-size: cover; overflow: hidden; }
.chip { display: inline-block; border: 1.5px solid rgba(255,255,255,.28); border-radius: 999px; padding: .35em .9em; font-weight: 600; }
.label { font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: #f26b38; }
`

const assets = [
  {
    name: 'cover-1128x191',
    width: 1128,
    height: 191,
    scale: 4,
    /* LinkedIn puts the page logo over the lower left of the cover, and phones crop the sides, so the words sit in the middle. */
    html: `
<style>
.panels { position: absolute; right: -50px; top: -4px; height: calc(100% + 8px); display: flex; gap: 7px; transform: skewX(-14deg); }
.panels div { width: 96px; height: 100%; background-size: auto 175%; background-repeat: no-repeat; filter: saturate(1.1); }
.fade { position: absolute; inset: 0; background: linear-gradient(90deg, #0f1216 0%, #0f1216 60%, rgba(15,18,22,0) 68%); }
.copy { position: absolute; left: 250px; top: 38px; }
.copy h1 { font-size: 42px; font-weight: 800; letter-spacing: -.025em; line-height: 1.02; }
.copy p { position: absolute; left: 400px; top: 6px; width: 200px; font-size: 14px; line-height: 1.5; font-weight: 600; color: rgba(255,255,255,.75); border-left: 2px solid #f26b38; padding-left: 14px; }
.copy p b { color: #fff; }
.stripe { position: absolute; left: 0; bottom: 0; width: 100%; height: 5px; background: linear-gradient(90deg, #f26b38 0 30%, transparent 30%); }
</style>
<div class="grain"></div>
<div class="panels">
  <div style="background-image:url('${poster('chaos')}'); background-position: 18% 100%"></div>
  <div style="background-image:url('${poster('gravity-gun')}'); background-position: 92% 100%"></div>
  <div style="background-image:url('${poster('bubbles')}'); background-position: 78% 100%"></div>
</div>
<div class="fade"></div>
<div class="copy">
  <h1>We make games<span class="o">.</span><br>Ours, and yours<span class="o">.</span></h1>
  <p>Independent game studio.<br>Making <b>Sheriff Town VR</b>.<br>Unity &amp; Unreal development.<br><b>praamix.com</b></p>
</div>
<div class="stripe"></div>`,
  },
  {
    name: 'post-1-hello',
    width: 1200,
    height: 1200,
    scale: 1,
    html: `
<style>
.wordmark { position: absolute; left: 96px; top: 96px; width: 300px; height: auto; }
.pieces { position: absolute; right: 70px; bottom: 96px; width: 420px; height: auto; opacity: .95; }
h1 { position: absolute; left: 96px; top: 300px; font-size: 128px; font-weight: 800; line-height: .98; letter-spacing: -.035em; }
p { position: absolute; left: 96px; top: 600px; width: 520px; font-size: 32px; line-height: 1.4; color: rgba(255,255,255,.8); font-weight: 500; }
.url { position: absolute; left: 96px; bottom: 96px; font-size: 28px; font-weight: 700; }
</style>
<div class="grain"></div>
${wordmark}
${pieces}
<h1>We make<br>games<span class="o">.</span><br>Ours, and<br>yours<span class="o">.</span></h1>
<p style="top:880px">An independent game studio. Our own games, and games built with you.</p>
<div class="url">praamix.com</div>`,
  },
  {
    name: 'post-2-sheriff-town-vr',
    width: 1200,
    height: 1200,
    scale: 1,
    html: `
<style>
.art { position: absolute; left: 0; top: 0; width: 1200px; height: 760px; background: url('${poster('chaos')}') center 40% / cover; }
.art::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 55%, #0f1216 100%); }
.copy { position: absolute; left: 80px; right: 80px; top: 760px; }
.label { font-size: 22px; }
h1 { margin-top: 18px; font-size: 76px; font-weight: 800; letter-spacing: -.03em; line-height: 1; }
p { margin-top: 22px; font-size: 30px; line-height: 1.4; color: rgba(255,255,255,.82); font-weight: 500; }
.note { position: absolute; right: 24px; top: 716px; font-size: 16px; color: rgba(255,255,255,.7); }
.foot { position: absolute; left: 80px; right: 80px; top: 1030px; display: flex; gap: 14px; font-size: 22px; }
</style>
<div class="art"></div>
<div class="note">Key art</div>
<div class="copy">
  <div class="label">Our first game · In development</div>
  <h1>Sheriff Town VR</h1>
  <p>A VR sandbox where you are the sheriff of a town that talks back.</p>
</div>
<div class="foot"><span class="chip">Meta Quest</span><span class="chip">PC VR</span><span class="chip">Physics sandbox</span></div>`,
  },
  {
    name: 'post-3-services',
    width: 1200,
    height: 1200,
    scale: 1,
    html: `
<style>
.label { position: absolute; left: 96px; top: 96px; font-size: 24px; }
h1 { position: absolute; left: 96px; top: 150px; font-size: 112px; font-weight: 800; line-height: 1; letter-spacing: -.035em; }
.engines { position: absolute; left: 96px; top: 430px; font-size: 40px; font-weight: 700; }
.grid { position: absolute; left: 96px; right: 96px; top: 530px; display: flex; flex-wrap: wrap; gap: 16px; font-size: 28px; }
.stages { position: absolute; left: 96px; right: 96px; top: 720px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px 28px; font-size: 24px; font-weight: 600; color: rgba(255,255,255,.85); }
.stages span b { color: #f26b38; font-weight: 800; margin-right: 10px; }
.steps { position: absolute; left: 96px; right: 96px; bottom: 170px; display: flex; gap: 10px; }
.steps i { flex: 1; height: 14px; border-radius: 7px; background: rgba(255,255,255,.18); }
.steps i:nth-child(-n+9) { background: linear-gradient(90deg, #f26b38, #f26b38); opacity: calc(.35 + var(--k) * .072); }
.cap { position: absolute; left: 96px; bottom: 96px; font-size: 26px; color: rgba(255,255,255,.8); font-weight: 600; }
.url { position: absolute; right: 96px; bottom: 96px; font-size: 26px; font-weight: 700; }
</style>
<div class="grain"></div>
<div class="label">Game development services</div>
<h1>Your game<span class="o">.</span><br>Our full pipeline<span class="o">.</span></h1>
<div class="engines">Unity <span class="o">/</span> Unreal Engine</div>
<div class="grid">
  ${['Mobile', 'PC', 'Web', 'Console', 'VR', 'AR & mixed reality', '2D & 3D', 'Single-player & multiplayer']
    .map((t) => `<span class="chip">${t}</span>`)
    .join('')}
</div>
<div class="stages"><span><b>01</b>Discovery &amp; planning</span><span><b>02</b>Design &amp; prototyping</span><span><b>03</b>Art &amp; production</span><span><b>04</b>Engineering</span><span><b>05</b>Multiplayer &amp; online</span><span><b>06</b>Audio</span><span><b>07</b>Optimisation &amp; QA</span><span><b>08</b>Release &amp; publishing</span><span><b>09</b>After launch</span></div>
<div class="steps">${Array.from({ length: 9 }, (_, k) => `<i style="--k:${k}"></i>`).join('')}</div>
<div class="cap">Nine stages, concept to launch. Take all of them, or one.</div>
<div class="url">praamix.com/services</div>`,
  },
  {
    name: 'post-4-people',
    width: 1200,
    height: 1200,
    scale: 1,
    html: `
<style>
.label { position: absolute; left: 96px; top: 96px; font-size: 24px; }
h1 { position: absolute; left: 96px; top: 150px; font-size: 96px; font-weight: 800; line-height: 1.02; letter-spacing: -.035em; }
.cards { position: absolute; left: 96px; right: 96px; top: 470px; display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
.card { border: 1.5px solid rgba(255,255,255,.16); border-radius: 28px; padding: 44px 40px; background: rgba(255,255,255,.03); }
.card svg { width: 84px; height: 120px; }
.card h2 { margin-top: 28px; font-size: 44px; font-weight: 800; letter-spacing: -.02em; }
.card .role { margin-top: 8px; font-size: 26px; font-weight: 700; }
.card .sub { margin-top: 4px; font-size: 22px; font-weight: 600; color: rgba(255,255,255,.9); }
.card p { margin-top: 16px; font-size: 24px; line-height: 1.45; color: rgba(255,255,255,.78); }
.url { position: absolute; left: 96px; bottom: 80px; font-size: 26px; font-weight: 700; }
</style>
<div class="grain"></div>
<div class="label">The studio</div>
<h1>Meet the people<br>behind Praamix<span class="o">.</span></h1>
<div class="cards">
  <div class="card">
    <svg viewBox="0 0 132 152"><circle cx="66" cy="33.4" r="33.4" fill="#fff"/><path d="M3 152L45.3 59.8L86.4 59.8L128.7 152Z" fill="#fff"/></svg>
    <h2>Prashant Gupta</h2>
    <div class="role o">Founder</div>
    <div class="sub">Unity Game Developer</div>
    <p>Gameplay systems, multiplayer and performance across mobile, PC, web and VR.</p>
  </div>
  <div class="card">
    <svg viewBox="0 0 132 152"><circle cx="66" cy="33.4" r="33.4" fill="#f26b38"/><path d="M3 152L45.3 59.8L86.4 59.8L128.7 152Z" fill="#f26b38"/></svg>
    <h2>Aman Yadav</h2>
    <div class="role o">Founder</div>
    <div class="sub">Unity 3D &amp; VR Developer</div>
    <p>Unity, VR interaction and AR experiences across mobile devices and headsets.</p>
  </div>
</div>
<div class="url">praamix.com/studio</div>`,
  },
  {
    /*
     * Prashant's personal profile cover. LinkedIn's personal covers are
     * 1584 x 396, with the profile photo over the lower left, so the words
     * start right of it and the art sits on the right edge.
     */
    name: 'personal-cover-prashant-1584x396',
    width: 1584,
    height: 396,
    scale: 2,
    html: `
<style>
.panels { position: absolute; right: -70px; top: -6px; height: calc(100% + 12px); display: flex; gap: 10px; transform: skewX(-14deg); }
.panels div { width: 150px; height: 100%; background-size: auto 150%; background-repeat: no-repeat; }
.fade { position: absolute; inset: 0; background: linear-gradient(90deg, #0f1216 0%, #0f1216 62%, rgba(15,18,22,0) 72%); }
.copy { position: absolute; left: 470px; top: 70px; }
.label { font-size: 19px; }
h1 { margin-top: 14px; font-size: 56px; font-weight: 800; letter-spacing: -.03em; line-height: 1.02; }
.skills { margin-top: 22px; font-size: 22px; font-weight: 600; color: rgba(255,255,255,.8); }
.skills b { color: #f26b38; margin: 0 8px; }
.wordmark { position: absolute; left: 470px; bottom: 40px; width: 150px; height: auto; }
.site { position: absolute; left: 640px; bottom: 40px; font-size: 18px; font-weight: 700; color: rgba(255,255,255,.75); line-height: 26px; }
.stripe { position: absolute; left: 0; bottom: 0; width: 100%; height: 8px; background: linear-gradient(90deg, #f26b38 0 22%, transparent 22%); }
</style>
<div class="grain"></div>
<div class="panels">
  <div style="background-image:url('${poster('gravity-gun')}'); background-position: 90% 100%"></div>
  <div style="background-image:url('${poster('chaos')}'); background-position: 15% 100%"></div>
  <div style="background-image:url('${poster('bubbles')}'); background-position: 78% 100%"></div>
</div>
<div class="fade"></div>
<div class="copy">
  <div class="label">Founder · Praamix</div>
  <h1>Building Sheriff Town VR<span class="o">.</span><br>And games with you<span class="o">.</span></h1>
  <div class="skills">Unity<b>/</b>Multiplayer<b>/</b>VR &amp; AR<b>/</b>Gameplay systems</div>
</div>
${wordmark}
<div class="site">praamix.com</div>
<div class="stripe"></div>`,
  },
]

await mkdir(out, { recursive: true })
const { browser, name } = await launchBrowser(['--allow-file-access-from-files'])
console.log(`Rendering with ${name}`)

for (const asset of assets) {
  const page = await browser.newPage({
    viewport: { width: asset.width, height: asset.height },
    deviceScaleFactor: asset.scale,
  })
  const htmlPath = path.join(out, `.${asset.name}.html`)
  await writeFile(htmlPath, `<!doctype html><meta charset="utf-8"><style>${base}</style>${asset.html}`)
  await page.goto(pathToFileURL(htmlPath).href)
  await page.evaluate(() => document.fonts.ready)
  await page.waitForLoadState('networkidle')
  const target = path.join(out, `${asset.name}.png`)
  await page.screenshot({ path: target })
  console.log(`  ${path.relative(root, target)}  ${asset.width * asset.scale}x${asset.height * asset.scale}`)
  await page.close()
  await rm(htmlPath)
}

await browser.close()
