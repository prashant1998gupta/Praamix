/*
 * The shapes that entries in site.ts have to follow.
 * Edit site.ts for words, images and links. This file rarely needs to change.
 */

/** One crop of an image, saved at several widths so phones download small files. */
export type ImageCrop = {
  /** Path without the size suffix, e.g. '/media/sheriff-town-vr/hero' */
  base: string
  /** Widths that exist as files: hero-480.webp, hero-800.webp and so on. */
  widths: number[]
  /** Pixel size of the largest file. Reserves the space before the image loads. */
  width: number
  height: number
}

export type GameImage = {
  /** Describe what the image shows. Read aloud by screen readers. */
  alt: string
  landscape: ImageCrop
  /** Optional taller crop (4:5) used on phones held upright. */
  portrait?: ImageCrop
  /** The part of the image to keep in frame when it is cropped, e.g. '30% 60%'. */
  focus?: string
  caption?: string
}

export type MediaSlot = {
  /** Named on the placeholder while `image` is null. */
  label: string
  image: GameImage | null
}

export type ExternalLink = { label: string; url: string }

export type Game = {
  /** The page address: /games/<slug> */
  slug: string
  title: string
  /** One word of the title set in the accent style. */
  accentWord?: string
  status: string
  summary: string
  standfirst: string
  intro: string[]
  identityHeading: string
  identity: { title: string; body: string; key?: boolean }[]
  media: {
    /** Homepage feature image. */
    feature: MediaSlot
    /** Main visual on the game page. */
    hero: MediaSlot
    /** Shown under the main visual while it is still a placeholder. */
    pendingNote: string
    /** The gallery section appears only when this list has images in it. */
    gallery: GameImage[]
  }
  development: {
    heading: string
    facts: { term: string; detail: string }[]
    note: string
  }
  /** The store section appears only when this list has real URLs in it. */
  storeLinks: ExternalLink[]
}
