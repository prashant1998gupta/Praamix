/*
 * Shared look for Prashant's explainer videos: title, two lanes (the common
 * way and the better way), a three-line takeaway, a question, and the footer.
 * Each day's HTML file calls series({...}) with its own lane drawings.
 */
const W = 1080, H = 1350
const C = {
  bg: '#070a0f', panel: '#0f141c', line: 'rgba(255,255,255,.08)', text: '#f4f6f8', soft: 'rgba(244,246,248,.62)',
  red: '#ff4d5e', green: '#2fe39a', blue: '#4cc3ff', orange: '#f26b38', amber: '#ffb02e', violet: '#a78bfa',
}
const F = (w, s) => `${w} ${s}px Manrope`
const ease = (k) => (k < 0 ? 0 : k > 1 ? 1 : 1 - Math.pow(1 - k, 3))
const fade = (t, a, d = 0.5) => ease((t - a) / d)
const lerp = (a, b, k) => a + (b - a) * k

function series(cfg) {
  const cx = document.getElementById('c').getContext('2d')
  const rr = (x, y, w, h, r) => { cx.beginPath(); cx.roundRect(x, y, w, h, r) }
  const tools = { cx, rr, C, F, ease, fade, lerp }

  function wrap(text, x, y, maxW, lh) {
    const words = text.split(' '); let line = ''
    for (const w of words) {
      const test = line ? line + ' ' + w : w
      if (cx.measureText(test).width > maxW && line) { cx.fillText(line, x, y); line = w; y += lh } else line = test
    }
    cx.fillText(line, x, y)
  }
  tools.wrap = wrap

  function lane(t, top, L) {
    const h = 470
    rr(40, top, 1000, h, 34); cx.fillStyle = C.panel; cx.fill(); cx.lineWidth = 2; cx.strokeStyle = C.line; cx.stroke()
    cx.textAlign = 'left'; cx.fillStyle = L.accent; cx.font = F(800, 40); cx.fillText(L.title, 80, top + 66)
    cx.fillStyle = C.soft; cx.font = F(600, 24); cx.fillText(L.sub, 80, top + 104)
    if (L.readout) {
      cx.font = F(800, 26); const vw = Math.max(cx.measureText(L.readout[1]).width, 220) + 40
      rr(80, top + 132, vw, 58, 14); cx.fillStyle = 'rgba(255,255,255,.04)'; cx.fill()
      cx.fillStyle = C.soft; cx.font = F(700, 17); cx.fillText(L.readout[0], 98, top + 157)
      cx.fillStyle = L.accent; cx.font = F(800, 26); cx.fillText(L.readout[1], 98, top + 183)
    }
    cx.save(); rr(40, top, 1000, h, 34); cx.clip()
    L.draw(t, { x: 40, y: top, w: 1000, h, top }, tools)
    cx.restore(); cx.textAlign = 'left'; cx.globalAlpha = 1
  }

  function draw(t) {
    cx.fillStyle = C.bg; cx.fillRect(0, 0, W, H)
    const g = cx.createRadialGradient(900, 0, 0, 900, 0, 900); g.addColorStop(0, 'rgba(242,107,56,.14)'); g.addColorStop(1, 'rgba(242,107,56,0)')
    cx.fillStyle = g; cx.fillRect(0, 0, W, H)

    cx.globalAlpha = fade(t, 0, 0.6); cx.textAlign = 'left'
    cx.fillStyle = C.orange; cx.font = F(800, 22); cx.fillText(`${cfg.pillar.toUpperCase()} · DAY ${String(cfg.day).padStart(2, '0')}`, 56, 78)
    cx.fillStyle = C.text; cx.font = F(800, 56); cx.fillText(cfg.title[0], 56, 146); cx.fillText(cfg.title[1], 56, 208)
    cx.fillStyle = C.orange; cx.fillText('.', 56 + cx.measureText(cfg.title[1]).width, 208)
    cx.fillStyle = C.soft; cx.font = F(600, 26); cx.fillText(cfg.subtitle, 56, 254)
    cx.globalAlpha = fade(t, 0.6, 0.6); lane(t, 290, cfg.lanes[0])
    cx.globalAlpha = fade(t, 1.0, 0.6); lane(t, 780, cfg.lanes[1])
    cx.globalAlpha = 1

    if (cfg.note) { cx.fillStyle = 'rgba(244,246,248,.45)'; cx.font = F(600, 18); cx.textAlign = 'right'; cx.fillText(cfg.note, 1024, 1290) }
    cx.textAlign = 'left'; cx.fillStyle = C.text; cx.font = F(800, 22); cx.fillText('Prashant Gupta', 56, 1290)
    cx.fillStyle = C.soft; cx.font = F(600, 18); cx.fillText('Founder, Praamix · Unity & multiplayer', 56, 1316)

    const T = cfg.takeawayAt
    const k = fade(t, T, 0.6)
    if (k > 0) {
      cx.globalAlpha = k * 0.985; cx.fillStyle = '#05070b'; cx.fillRect(0, 0, W, H); cx.globalAlpha = k
      const y = 380 + (1 - k) * 40
      cx.fillStyle = C.orange; cx.font = F(800, 24); cx.fillText(cfg.takeawayLabel || 'THE FIX, IN THREE LINES', 70, y)
      const cols = [C.green, C.amber, C.blue]
      cfg.rows.forEach(([a, b], i) => {
        const ry = y + 60 + i * 170
        cx.globalAlpha = k * fade(t, T + 0.4 + i * 0.5, 0.5)
        rr(70, ry, 940, 140, 26); cx.fillStyle = '#121925'; cx.fill()
        cx.fillStyle = cols[i]; cx.font = F(800, 64); cx.fillText(String(i + 1), 110, ry + 94)
        cx.fillStyle = C.text; cx.font = F(800, 44); cx.fillText(a, 190, ry + 66)
        cx.fillStyle = C.soft; cx.font = F(600, 27); cx.fillText(b, 190, ry + 108)
      })
      cx.globalAlpha = k * fade(t, T + 2.4, 0.6)
      cx.fillStyle = C.text; cx.font = F(800, 40); cx.fillText(cfg.question[0], 70, y + 660); cx.fillText(cfg.question[1], 70, y + 712)
      cx.globalAlpha = 1
    }
  }

  window.draw = draw
  window.DURATION = cfg.duration
  if (!new URLSearchParams(location.search).has('render')) {
    const t0 = performance.now()
    const loop = () => { draw(((performance.now() - t0) / 1000) % cfg.duration); requestAnimationFrame(loop) }
    document.fonts.ready.then(loop)
  }
}

/* A walking stick figure, shared by the days that need a person. */
function figure(cx, x, y, color, t, alpha = 1, walking = false, scale = 1.4) {
  cx.save(); cx.translate(x, y); cx.scale(scale, scale); cx.globalAlpha = alpha
  cx.strokeStyle = color; cx.fillStyle = color; cx.lineCap = 'round'; cx.lineWidth = 9
  const ph = walking ? Math.sin(t * 14) : 0
  cx.beginPath(); cx.arc(0, -112, 19, 0, Math.PI * 2); cx.fill()
  cx.beginPath(); cx.moveTo(0, -90); cx.lineTo(0, -44); cx.stroke()
  for (const s of [1, -1]) {
    cx.beginPath(); cx.moveTo(0, -82); cx.lineTo(20 * ph * s, -54); cx.stroke()
    cx.beginPath(); cx.moveTo(0, -44); cx.lineTo(22 * ph * s, 0); cx.stroke()
  }
  cx.restore()
}
