/*
 * The pictures the site uses and the sizes each one is saved at.
 * Originals live in media-source/. Run `npm run media` after changing this file.
 */

/* Widths in pixels. A phone picks a small file, a large screen a sharp one. */
const FULL = [480, 768, 1080, 1536]

/* Sheriff Town VR, from the game's own scenes and renders. scripts/stage-game-art.mjs prepares these sources. */
const CAPTURE = [480, 768, 1080, 1440]
/* The Dispatch board's own map pictures, enlarged once by scripts/stage-game-art.mjs. */
const MAP = [480, 768, 1152]

export const IMAGES = [
  { name: 'world-building', source: 'game-development-services.png', widths: FULL },
  { name: 'art-sequence', source: 'game-production-pipeline.png', widths: [480, 768, 1080, 1440, 1774] },
  { name: 'device-family', source: 'game-platforms.png', widths: FULL },
  { name: 'character-study', source: 'game-art-animation.png', widths: FULL },
  { name: 'town-tree', source: 'praamix-studio-detail.png', widths: FULL },

  { name: 'stv-arrival', source: 'game/hub-arrival.png', widths: CAPTURE },
  { name: 'stv-lineup', source: 'game/hub-lineup.png', widths: CAPTURE },
  { name: 'stv-fun-court', source: 'game/hub-funcourt.png', widths: CAPTURE },
  { name: 'stv-district', source: 'game/hub-district.png', widths: CAPTURE },
  { name: 'stv-experiments', source: 'game/hub-experiments.png', widths: CAPTURE },
  { name: 'stv-shop', source: 'game/hub-shop.png', widths: CAPTURE },
  { name: 'stv-armory', source: 'game/hub-armory.png', widths: CAPTURE },
  { name: 'stv-bottle-trap', source: 'game/bottle-trap.png', widths: [480, 768, 1080, 1280] },
  { name: 'stv-tool-guns', source: 'game/tool-guns.png', widths: [480, 768, 1080, 1600] },
  { name: 'stv-physics-tools', source: 'game/physics-tools.png', widths: [480, 768, 1080, 1600] },
  { name: 'stv-fort', source: 'game/frontier-fort.png', widths: [480, 768, 1080, 1600] },

  { name: 'map-police-station', source: 'game/map-police-station.png', widths: MAP },
  { name: 'map-grocery-store', source: 'game/map-grocery-store.png', widths: MAP },
  { name: 'map-rooftop-restaurant', source: 'game/map-rooftop-restaurant.png', widths: MAP },
  { name: 'map-fun-ranch', source: 'game/map-fun-ranch.png', widths: MAP },
  { name: 'map-rattlesnake-den', source: 'game/map-rattlesnake-den.png', widths: MAP },
  { name: 'map-colour-bridge', source: 'game/map-colour-bridge.png', widths: MAP },
]

/* Transparent cut-outs of the tool guns and physics tools, for the 3D rack. */
const GUNS = ['spawn', 'physics', 'gravity', 'portal', 'ice', 'bubble', 'size', 'copypaste', 'food', 'scanner', 'joint', 'harpoon', 'connection', 'modification']
const TOOLS = ['thruster', 'motor', 'piston', 'propeller', 'stabilizer', 'balloon', 'climbinggrip', 'lever']
const cutout = (name) => ({ name, source: `game/cutouts/${name}.png`, widths: [320, 480, 640], alpha: true })
IMAGES.push(...GUNS.map((gun) => cutout(`gun-${gun}`)), ...TOOLS.map((tool) => cutout(`tool-${tool}`)))

export const LOGO = {
  name: 'praamix-logo',
  source: 'praamix-logo.png',
  widths: [192, 384, 576],
  /* Where the P mark sits in the original. Used for the browser tab icon. */
  mark: { left: 58, top: 171, width: 396, height: 389 },
}
