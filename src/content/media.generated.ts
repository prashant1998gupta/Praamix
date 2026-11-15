/* Written by `npm run media`. Do not edit by hand: change scripts/media.config.mjs and run it again. */
import type { ImageFile } from './types.ts'

export const media = {
  "world-building": {
    "base": "/media/world-building",
    "widths": [
      480,
      768,
      1080,
      1536
    ],
    "width": 1536,
    "height": 1024,
    "fallback": 1080
  },
  "art-sequence": {
    "base": "/media/art-sequence",
    "widths": [
      480,
      768,
      1080,
      1440,
      1774
    ],
    "width": 1774,
    "height": 887,
    "fallback": 1080
  },
  "device-family": {
    "base": "/media/device-family",
    "widths": [
      480,
      768,
      1080,
      1536
    ],
    "width": 1536,
    "height": 1024,
    "fallback": 1080
  },
  "character-study": {
    "base": "/media/character-study",
    "widths": [
      480,
      768,
      1080,
      1536
    ],
    "width": 1536,
    "height": 1024,
    "fallback": 1080
  },
  "town-in-hands": {
    "base": "/media/town-in-hands",
    "widths": [
      480,
      768,
      1080,
      1536
    ],
    "width": 1536,
    "height": 1024,
    "fallback": 1080
  },
  "town-tree": {
    "base": "/media/town-tree",
    "widths": [
      480,
      768,
      1080,
      1536
    ],
    "width": 1536,
    "height": 1024,
    "fallback": 1080
  },
  "town-detail-centre": {
    "base": "/media/town-detail-centre",
    "widths": [
      480,
      680
    ],
    "width": 680,
    "height": 510,
    "fallback": 680
  },
  "town-detail-hands": {
    "base": "/media/town-detail-hands",
    "widths": [
      480,
      680
    ],
    "width": 680,
    "height": 510,
    "fallback": 680
  },
  "town-detail-street": {
    "base": "/media/town-detail-street",
    "widths": [
      480,
      680
    ],
    "width": 680,
    "height": 510,
    "fallback": 680
  },
  "praamix-logo": {
    "base": "/media/praamix-logo",
    "widths": [
      192,
      384,
      576
    ],
    "width": 576,
    "height": 108,
    "fallback": 384
  }
} satisfies Record<string, ImageFile>
