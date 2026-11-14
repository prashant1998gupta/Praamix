/*
 * How wide each capital letter and digit sets in the three faces used for
 * game titles, in em. Game titles are sized to fill their column exactly, and
 * CSS cannot measure text, so the widths are kept here.
 *
 * Measured by scripts/measure-glyphs.mjs. Run it again and paste its output
 * over GLYPHS and WIDTHS if the fonts or the .game-title styles change.
 */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 &-:'.!?"

const WIDTHS = {
  /* Archivo 800, condensed: one word per line on narrow screens */
  stacked: [
    0.584, 0.572, 0.589, 0.589, 0.537, 0.479, 0.629, 0.601, 0.273, 0.496, 0.593, 0.484, 0.758,
    0.604, 0.634, 0.55, 0.634, 0.584, 0.537, 0.532, 0.594, 0.56, 0.797, 0.572, 0.566, 0.538, 0.495,
    0.452, 0.489, 0.493, 0.487, 0.494, 0.495, 0.464, 0.487, 0.495, 0.142, 0.63, 0.272, 0.26, 0.221,
    0.248, 0.277, 0.479,
  ],
  /* Archivo 800, regular width: the whole title on one line on wide screens */
  line: [
    0.746, 0.745, 0.752, 0.755, 0.699, 0.641, 0.815, 0.787, 0.329, 0.63, 0.77, 0.623, 0.914, 0.787,
    0.81, 0.698, 0.81, 0.75, 0.697, 0.675, 0.783, 0.729, 0.979, 0.736, 0.732, 0.682, 0.625, 0.625,
    0.625, 0.625, 0.626, 0.625, 0.625, 0.625, 0.625, 0.625, 0.189, 0.816, 0.333, 0.334, 0.263,
    0.318, 0.314, 0.612,
  ],
  /* Instrument Serif italic: the accent word */
  accent: [
    0.457, 0.479, 0.475, 0.536, 0.454, 0.411, 0.514, 0.545, 0.25, 0.251, 0.499, 0.414, 0.665, 0.542,
    0.54, 0.469, 0.541, 0.525, 0.424, 0.461, 0.537, 0.458, 0.653, 0.545, 0.478, 0.427, 0.461, 0.248,
    0.404, 0.373, 0.394, 0.387, 0.411, 0.365, 0.437, 0.414, 0.17, 0.525, 0.426, 0.299, 0.235, 0.219,
    0.275, 0.358,
  ],
}

type Face = keyof typeof WIDTHS

/* Used for any character that is not in the table. Deliberately on the wide side. */
const TYPICAL: Record<Face, number> = { stacked: 0.64, line: 0.82, accent: 0.55 }

/* Matches letter-spacing on .game-title. The accent word is set without it. */
const TRACKING = -0.02

/* A little room for the lean of the italic at the end of a line. */
const MARGIN = 1.03

function widthOf(text: string, face: Face): number {
  let width = 0
  for (const glyph of text) {
    const index = GLYPHS.indexOf(glyph)
    width += index >= 0 ? WIDTHS[face][index] : TYPICAL[face]
    if (face !== 'accent') width += TRACKING
  }
  return width
}

const round = (value: number) => Number(value.toFixed(3))

/**
 * The width of a title in em, two ways: its widest word when each word has its
 * own line, and the whole title on a single line. CSS divides the width of the
 * column by these to get the type size.
 */
export function titleFit(title: string, accentWord?: string): { stacked: number; line: number } {
  const accent = accentWord?.toUpperCase()
  const words = title.toUpperCase().split(' ')
  const widths = (face: Face) =>
    words.map((word) => widthOf(word, word === accent ? 'accent' : face))

  const spaces = widthOf(' ', 'line') * (words.length - 1)
  const line = widths('line').reduce((sum, width) => sum + width, 0) + spaces

  return {
    stacked: round(Math.max(...widths('stacked')) * MARGIN),
    line: round(line * MARGIN),
  }
}
