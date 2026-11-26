/*
 * Adds an ElevenLabs voice-over to one of the explainer videos.
 *
 *   node scripts/personal-video/voiceover.mjs client-prediction <voiceId> [label]
 *
 * Reads the timed lines from scripts/personal-video/<name>.voice.json, makes one
 * clip per line with the ElevenLabs text-to-speech API, places each clip at
 * its start time (sped up slightly only if it would run into the next line),
 * and writes brand/linkedin/personal-series/<name>-<label>.mp4.
 *
 * The API key comes from the ELEVENLABS_API_KEY environment variable and is
 * never printed or written to disk.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../', import.meta.url))
const [name, voice, label = 'voice'] = process.argv.slice(2)
const key = process.env.ELEVENLABS_API_KEY
if (!name || !voice) throw new Error('Usage: voiceover.mjs <name> <voiceId> [label]')
if (!key) throw new Error('ELEVENLABS_API_KEY is not set')

const lines = JSON.parse(await readFile(path.join(root, 'scripts/personal-video', `${name}.voice.json`), 'utf8'))
const video = path.join(root, 'brand/linkedin/personal-series', `${name}.mp4`)
const work = path.join(os.tmpdir(), `praamix-vo-${name}-${label}`)
await rm(work, { recursive: true, force: true })
await mkdir(work, { recursive: true })

const probe = (f) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim())
const videoLength = probe(video)

const clips = []
for (const [i, line] of lines.entries()) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'content-type': 'application/json', accept: 'audio/mpeg' },
    body: JSON.stringify({
      text: line.text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true },
    }),
  })
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 200)}`)
  const raw = path.join(work, `raw${i}.mp3`)
  await writeFile(raw, Buffer.from(await res.arrayBuffer()))
  const next = lines[i + 1]?.at ?? videoLength - 0.2
  const room = next - line.at - 0.15
  const length = probe(raw)
  const tempo = length > room ? Math.min(1.25, length / room) : 1
  clips.push({ file: raw, at: line.at, tempo, length })
  console.log(`line ${i + 1}: ${length.toFixed(2)}s, room ${room.toFixed(2)}s${tempo > 1 ? `, sped ${tempo.toFixed(2)}x` : ''}`)
}

/* Place every clip at its time, mix, and lay the result under the video. */
const inputs = clips.flatMap((c) => ['-i', c.file])
const chains = clips.map((c, i) => `[${i + 1}:a]${c.tempo > 1 ? `atempo=${c.tempo.toFixed(3)},` : ''}adelay=${Math.round(c.at * 1000)}|${Math.round(c.at * 1000)}[a${i}]`)
const mix = `${chains.join(';')};${clips.map((_, i) => `[a${i}]`).join('')}amix=inputs=${clips.length}:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11[out]`
const out = path.join(root, 'brand/linkedin/personal-series', `${name}-${label}.mp4`)
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', video, ...inputs, '-filter_complex', mix,
  '-map', '0:v', '-map', '[out]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-t', String(videoLength), '-movflags', '+faststart', out])
await rm(work, { recursive: true, force: true })
console.log(`wrote ${path.relative(root, out)}`)
