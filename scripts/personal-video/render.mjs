/*
 * Renders one of Prashant's explainer animations to an MP4 for LinkedIn.
 *
 *   node scripts/personal-video/render.mjs client-prediction
 *
 * Reads scripts/personal-video/<name>.html, calls its draw(t) for every frame
 * at 30 fps, and encodes brand/linkedin/personal-series/<name>.mp4 (H.264,
 * 1080 x 1350, silent) with ffmpeg, plus a cover frame <name>-cover.png.
 */
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { launchBrowser, root } from '../checks/browser.mjs'

const name = process.argv[2]
if (!name) throw new Error('Name the animation, e.g. client-prediction')
const FPS = 30
const src = path.join(root, 'scripts/personal-video', `${name}.html`)
const out = path.join(root, 'brand/linkedin/personal-series')
const frames = path.join(os.tmpdir(), `praamix-frames-${name}`)
await rm(frames, { recursive: true, force: true })
await mkdir(frames, { recursive: true })
await mkdir(out, { recursive: true })

const { browser } = await launchBrowser(['--allow-file-access-from-files'])
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
await page.goto(pathToFileURL(src).href + '?render')
await page.evaluate(() => document.fonts.ready)
const duration = await page.evaluate(() => window.DURATION)
const total = Math.round(duration * FPS)

for (let i = 0; i < total; i++) {
  const data = await page.evaluate((t) => {
    window.draw(t)
    return document.getElementById('c').toDataURL('image/png')
  }, i / FPS)
  await writeFile(path.join(frames, `f${String(i).padStart(5, '0')}.png`), Buffer.from(data.split(',')[1], 'base64'))
  if (i % 150 === 0) console.log(`frame ${i}/${total}`)
}
await browser.close()

const mp4 = path.join(out, `${name}.mp4`)
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(frames, 'f%05d.png'),
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'slow', '-movflags', '+faststart', mp4])
/* The cover LinkedIn shows before play: mid-action, both lanes busy. */
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(frames, `f${String(Math.round(7.4 * FPS)).padStart(5, '0')}.png`), path.join(out, `${name}-cover.png`)])
await rm(frames, { recursive: true, force: true })
console.log(`wrote ${path.relative(root, mp4)} (${duration}s)`)
