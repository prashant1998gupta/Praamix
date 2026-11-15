/* The shapes the content files follow. Edit the content files, not this one. */

/** A picture saved at several widths by `npm run media`. */
export type ImageFile = {
  /** Path without size or format, e.g. '/media/town-in-hands'. */
  base: string
  widths: number[]
  /** Pixel size of the largest file. Reserves the space before the picture loads. */
  width: number
  height: number
  /** Width of the plain JPEG or PNG that older browsers use. */
  fallback: number
  /** 'png' for a transparent cut-out; otherwise the fallback is a JPEG. */
  fallbackType?: 'png'
}

export type SiteImage = {
  file: ImageFile
  /** Describes the picture for people who cannot see it. */
  alt: string
  /** Shown under the picture. Says what kind of artwork it is. */
  caption: string
  /** The picture's own background colour, shown behind it while it loads. */
  tone: string
}

export type IconName =
  | 'bulb'
  | 'pencil'
  | 'code'
  | 'rocket'
  | 'phone'
  | 'monitor'
  | 'globe'
  | 'gamepad'
  | 'headset'
  | 'layers'
  | 'external'

export type Faq = { question: string; answer: string }

export type ExternalLink = { label: string; url: string }

/** One real store page for a game. */
export type StoreEntry = {
  /** The store's name, e.g. 'Steam'. */
  store: string
  url: string
  /** available: on sale now. wishlist and preorder: a real listing that is not on sale yet. */
  state: 'available' | 'wishlist' | 'preorder'
  /** The platform this listing is for, if the store has several. */
  platform?: string
  /** A confirmed price, exactly as the store shows it. */
  price?: string
  /** Replaces the usual button wording. */
  label?: string
}
