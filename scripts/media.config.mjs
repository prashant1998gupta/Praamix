/*
 * The pictures the site uses and the sizes each one is saved at.
 * Originals live in media-source/. Run `npm run media` after changing this file.
 */

/* Widths in pixels. A phone picks a small file, a large screen a sharp one. */
const FULL = [480, 768, 1080, 1536]
const DETAIL = [480, 680]

/* Every close-up is cut from the town illustration. */
const TOWN = 'praamix-studio-hero.png'

export const IMAGES = [
  { name: 'world-building', source: 'game-development-services.png', widths: FULL },
  { name: 'art-sequence', source: 'game-production-pipeline.png', widths: [480, 768, 1080, 1440, 1774] },
  { name: 'device-family', source: 'game-platforms.png', widths: FULL },
  { name: 'character-study', source: 'game-art-animation.png', widths: FULL },
  { name: 'town-in-hands', source: TOWN, widths: FULL },
  { name: 'town-tree', source: 'praamix-studio-detail.png', widths: FULL },

  /* `crop` is measured in pixels of the original, which is 1536 by 1024. */
  { name: 'town-detail-centre', source: TOWN, crop: { left: 540, top: 20, width: 680, height: 510 }, widths: DETAIL },
  { name: 'town-detail-hands', source: TOWN, crop: { left: 0, top: 440, width: 680, height: 510 }, widths: DETAIL },
  { name: 'town-detail-street', source: TOWN, crop: { left: 560, top: 330, width: 680, height: 510 }, widths: DETAIL },
]

export const LOGO = {
  name: 'praamix-logo',
  source: 'praamix-logo.png',
  widths: [192, 384, 576],
  /* Where the P mark sits in the original. Used for the browser tab icon. */
  mark: { left: 58, top: 171, width: 396, height: 389 },
}
