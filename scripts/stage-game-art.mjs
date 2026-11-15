/*
 * Prepares the Sheriff Town VR pictures in media-source/game/ from the game's
 * own art exports. Run it when the game's art changes, then `npm run media`.
 *
 *   node scripts/stage-game-art.mjs "D:\...\Sheriff_Town_VR_Exports_and_Tool\Exports" "D:\...\Sheriff Town VR"
 *
 * Nothing here invents or repaints game art:
 *   - In-game captures get a gentle sharpen and grade.
 *   - Model renders are lifted off their flat render background, the edges
 *     are cleaned of that colour, and the models are set on a studio backdrop
 *     with a soft floor shadow. The models themselves are untouched.
 *   - The Dispatch board's small map pictures are enlarged once with a
 *     high-quality filter, so they stay crisp at the size the page draws them.
 */
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const [exportsRoot, gameRoot] = process.argv.slice(2)
if (!exportsRoot || !gameRoot) {
  console.error('Usage: node scripts/stage-game-art.mjs <art exports folder> <Unity project folder>')
  process.exit(1)
}

const out = fileURLToPath(new URL('../media-source/game/', import.meta.url))
await mkdir(out, { recursive: true })
const from = (...parts) => join(exportsRoot, ...parts)

/* ---------- In-game captures: a gentle sharpen and grade ---------- */

const grade = (input) =>
  sharp(input)
    .removeAlpha()
    .linear(1.05, -5)
    .modulate({ saturation: 1.08 })
    .sharpen({ sigma: 0.7, m1: 0.5, m2: 1.4 })

const PLAY = from('PrecinctDistrict', 'Art', 'ColourDirection_2026-11-05', 'Unity', 'Play')
const captures = {
  'hub-arrival': join(PLAY, 'Arrival.png'),
  'hub-lineup': join(PLAY, 'Lineup.png'),
  'hub-funcourt': join(PLAY, 'FunCourt.png'),
  'hub-district': join(PLAY, 'District.png'),
  'hub-experiments': join(PLAY, 'Experiments.png'),
  'hub-shop': join(PLAY, 'Shop.png'),
  'hub-armory': join(PLAY, 'Armory.png'),
  'bottle-trap': from('ContainmentBottle_Gameplay_2026-10-30', 'Unity', '03_Inside_Front.png'),
}
for (const [name, file] of Object.entries(captures)) {
  await grade(file).png({ compressionLevel: 9 }).toFile(join(out, `${name}.png`))
}

/* ---------- The Dispatch board's map pictures: enlarged once, then graded ---------- */

const DISPATCH = join(gameRoot, 'Assets', '_SheriffTown', 'Art', 'UI', 'Dispatch')
const maps = {
  'map-police-station': 'Map_3.png',
  'map-grocery-store': 'Map_1.png',
  'map-rooftop-restaurant': 'Map_2.png',
  'map-fun-ranch': 'Map_4.png',
  'map-rattlesnake-den': 'Map_GangsterDen.png',
  'map-colour-bridge': 'Map_ColourBridge.png',
}
for (const [name, file] of Object.entries(maps)) {
  const input = join(DISPATCH, file)
  const { width } = await sharp(input).metadata()
  const enlarged = await sharp(input).removeAlpha().resize({ width: Math.round(width * 1.5), kernel: 'lanczos3' }).toBuffer()
  await grade(enlarged).png({ compressionLevel: 9 }).toFile(join(out, `${name}.png`))
}

/* ---------- Model renders: lifted off the flat background ---------- */

/**
 * Makes the render's flat background transparent. Only background-coloured
 * pixels joined to the picture's edge are removed, so a part of the model that
 * happens to share the colour stays solid. Edge pixels lose the background's
 * tint, so no grey halo is left round the model.
 */
async function lift(input, region) {
  let image = sharp(input).removeAlpha()
  if (region) image = image.extract(region)
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true })
  const { width, height } = info
  const bg = [data[0], data[1], data[2]]
  const NEAR = 40
  const SOLID = 9

  const distance = new Float32Array(width * height)
  for (let i = 0; i < width * height; i += 1) {
    const r = data[i * 3] - bg[0]
    const g = data[i * 3 + 1] - bg[1]
    const b = data[i * 3 + 2] - bg[2]
    distance[i] = Math.sqrt(r * r + g * g + b * b)
  }

  /* Walk inwards from the edge through background-like pixels. */
  const outside = new Uint8Array(width * height)
  const queue = new Int32Array(width * height)
  let head = 0
  let tail = 0
  const seed = (i) => {
    if (!outside[i] && distance[i] < NEAR) {
      outside[i] = 1
      queue[tail++] = i
    }
  }
  for (let x = 0; x < width; x += 1) {
    seed(x)
    seed((height - 1) * width + x)
  }
  for (let y = 0; y < height; y += 1) {
    seed(y * width)
    seed(y * width + width - 1)
  }
  while (head < tail) {
    const i = queue[head++]
    const x = i % width
    if (x > 0) seed(i - 1)
    if (x < width - 1) seed(i + 1)
    if (i >= width) seed(i - width)
    if (i < width * (height - 1)) seed(i + width)
  }

  const rgba = Buffer.alloc(width * height * 4)
  for (let i = 0; i < width * height; i += 1) {
    let alpha = 1
    if (outside[i]) alpha = Math.min(1, Math.max(0, (distance[i] - SOLID) / (NEAR - SOLID)))
    for (let c = 0; c < 3; c += 1) {
      const value = data[i * 3 + c]
      /* Take the background's share back out of a part-transparent edge pixel. */
      const clean = alpha > 0 && alpha < 1 ? (value - (1 - alpha) * bg[c]) / alpha : value
      rgba[i * 4 + c] = Math.max(0, Math.min(255, Math.round(clean)))
    }
    rgba[i * 4 + 3] = Math.round(alpha * 255)
  }

  return sharp(rgba, { raw: { width, height, channels: 4 } }).trim({ threshold: 1 }).png().toBuffer()
}

/** The studio backdrop: deep navy with a soft pool of light, like the game's Dispatch board. */
function backdrop(width, height) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <radialGradient id="glow" cx="50%" cy="42%" r="75%">
        <stop offset="0" stop-color="#34445a"/>
        <stop offset="0.55" stop-color="#222c3a"/>
        <stop offset="1" stop-color="#151b24"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#glow)"/>
  </svg>`
  return sharp(Buffer.from(svg)).png().toBuffer()
}

/** A model fitted inside a box, standing on the box's floor, with a soft shadow under it. */
async function placed(model, box) {
  const fitted = await sharp(model)
    .resize({ width: Math.round(box.width), height: Math.round(box.height), fit: 'inside', kernel: 'lanczos3' })
    .sharpen({ sigma: 0.6, m1: 0.4, m2: 1 })
    .png()
    .toBuffer({ resolveWithObject: true })
  const { width, height } = fitted.info
  const left = Math.round(box.left + (box.width - width) / 2)
  const top = Math.round(box.top + box.height - height)

  /* A soft oval shadow on the floor under the model. */
  const shadowWidth = Math.round(width * 0.9)
  const shadowHeight = Math.max(12, Math.round(width * 0.14))
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${shadowWidth}" height="${shadowHeight}">
    <defs>
      <radialGradient id="s" cx="50%" cy="50%" r="50%">
        <stop offset="0" stop-color="#05070a" stop-opacity="0.6"/>
        <stop offset="0.6" stop-color="#05070a" stop-opacity="0.22"/>
        <stop offset="1" stop-color="#05070a" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill="url(#s)"/>
  </svg>`
  const shadow = await sharp(Buffer.from(svg)).png().toBuffer()

  return [
    {
      input: shadow,
      left: Math.round(left + (width - shadowWidth) / 2),
      top: Math.round(top + height - shadowHeight * 0.55),
    },
    { input: fitted.data, left, top },
  ]
}

/** Several models in rows on one backdrop. `rows` gives how many sit in each row. */
async function plate(models, { width, height, rows, pad = 0.07, gap = 0.18 }) {
  const layers = []
  const rowHeight = height / rows.length
  let index = 0
  for (const [row, count] of rows.entries()) {
    const cellWidth = (width * (1 - pad * 2)) / count
    for (let column = 0; column < count; column += 1) {
      const model = models[index++]
      const boxWidth = cellWidth * (1 - gap)
      const boxHeight = rowHeight * (1 - gap * 1.6)
      layers.push(
        ...(await placed(model, {
          left: width * pad + column * cellWidth + (cellWidth - boxWidth) / 2,
          top: row * rowHeight + (rowHeight - boxHeight) * 0.62,
          width: boxWidth,
          height: boxHeight,
        })),
      )
    }
  }
  return sharp(await backdrop(width, height)).composite(layers)
}

/* The physics tools, in their current workshop finish, each shown switched on. */
const WORKSHOP = from('PhysicsToolsArt', 'WarmWorkshop_2026-10-25')
const tools = ['Thruster', 'Motor', 'Piston', 'Propeller', 'Stabilizer', 'Balloon', 'ClimbingGrip', 'Lever']
const toolModels = []
for (const name of tools) toolModels.push(await lift(join(WORKSHOP, `Unity_${name}_Active_LOD0.png`)))
await (await plate(toolModels, { width: 1600, height: 1000, rows: [4, 4] }))
  .png({ compressionLevel: 9 })
  .toFile(join(out, 'physics-tools.png'))

/* The tool guns, cut from the 4 by 4 render sheet (the last row holds two). */
const SHEET = from('ToolGunsArt', 'CleanColour_2026-10-20', 'Unity_Clean_All.png')
const { width: sheetWidth } = await sharp(SHEET).metadata()
const cell = sheetWidth / 4
const gunModels = []
for (let i = 0; i < 14; i += 1) {
  const region = { left: Math.round((i % 4) * cell), top: Math.round(Math.floor(i / 4) * cell), width: Math.round(cell), height: Math.round(cell) }
  gunModels.push(await lift(SHEET, region))
}
await (await plate(gunModels, { width: 1600, height: 1100, rows: [5, 4, 5], gap: 0.14 }))
  .png({ compressionLevel: 9 })
  .toFile(join(out, 'tool-guns.png'))

/* The frontier fort, on its own. */
const fort = await lift(from('FrontierBuildDemo', 'Unity_Demo.png'))
await (await plate([fort], { width: 1600, height: 1100, rows: [1], pad: 0.1, gap: 0.12 }))
  .png({ compressionLevel: 9 })
  .toFile(join(out, 'frontier-fort.png'))

console.log(`stage-game-art: wrote ${Object.keys(captures).length + Object.keys(maps).length + 3} pictures to media-source/game/`)
