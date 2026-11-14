/*
 * The shapes the layouts give to media frames, described for the browser so it
 * can pick the smallest image file that fills each one.
 *
 * Keep in step with feature.css, game.css and game-sections.css. If a frame
 * changes size or shape there, update its entry here.
 */

export type Slot = {
  /** The screens this applies to, as a media condition. Left out on the last entry. */
  media?: string
  /** How wide the frame is drawn on those screens. */
  width: string
}

export type Frame = {
  /** Where the frame is wider than tall. The browser uses the first entry that matches. */
  wide: Slot[]
  /** Screens where the frame is taller than wide. */
  tall?: Required<Slot>[]
}

/** Shape of the tall frames, and of the portrait crops made by `npm run media`. */
export const TALL_RATIO = 4 / 5

/** Images shown whole are never drawn taller than this share of the screen height, in percent. */
export const NATURAL_MAX_HEIGHT = 92

/* Short screens get shallow frames instead of tall ones. */
const NOT_SHORT = '(min-height: 32.01em)'

/* On phones a frame spans the screen, less the left margin and its backing slab. */
const PHONE_FRAME = '94vw'

/** Homepage feature. Tall on phones and tablets, wide beside the text from laptops up. */
export const featureFrame: Frame = {
  wide: [
    { media: '(min-width: 96em)', width: '1200px' },
    { media: '(min-width: 64em)', width: '64vw' },
    { media: '(min-width: 40em) and (max-height: 32em)', width: '64vw' },
    { width: '100vw' },
  ],
  tall: [
    { media: `(min-width: 45em) and (max-width: 63.99em) and ${NOT_SHORT}`, width: '42vw' },
    { media: `(max-width: 44.99em) and ${NOT_SHORT}`, width: PHONE_FRAME },
  ],
}

/** Main visual on a game page. Tall on phones only. */
export const heroFrame: Frame = {
  wide: [
    { media: '(min-width: 96em)', width: '1200px' },
    { media: '(min-width: 64em)', width: '66vw' },
    { media: '(min-width: 40em) and (max-height: 32em)', width: '66vw' },
    { width: '100vw' },
  ],
  tall: [{ media: `(max-width: 44.99em) and ${NOT_SHORT}`, width: PHONE_FRAME }],
}

/** Gallery images, shown at their own proportions. */
export const galleryFrame: Frame = {
  wide: [
    { media: '(min-width: 96em)', width: '1100px' },
    { media: '(min-width: 45em)', width: '58vw' },
    { width: '100vw' },
  ],
}
