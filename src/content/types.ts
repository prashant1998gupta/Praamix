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
  | 'play'
  | 'chat'

export type Faq = { question: string; answer: string }

export type ExternalLink = { label: string; url: string }

/**
 * A real trailer on YouTube. Nothing is loaded from YouTube with the page: the
 * player is fetched only when a visitor presses play. The Privacy Policy says so.
 */
export type Trailer = {
  /** The part after `v=` in the video's address. */
  youtubeId: string
  /** The video's own page, for people who would rather watch it there. */
  url: string
  /** The video's name. Read out by screen readers. */
  title: string
  /** The wording on the play buttons. */
  label: string
  eyebrow: string
  heading: string
  lede: string
  /** Said under the picture, so visitors know where the video comes from. */
  note: string
  /** A picture from the game, shown until the visitor presses play. */
  poster: SiteImage
}

/** One poster of a game's key art, as shown in the homepage slideshow. */
export type Poster = {
  id: string
  /** What the poster shows, in a word or two. */
  title: string
  /** Where in the game it is set. */
  place: string
  image: SiteImage
}

/** A real place to follow a game, such as a community server or a video channel. */
export type Channel = {
  /** The service's name, e.g. 'Discord'. */
  name: string
  url: string
  icon: IconName
  title: string
  text: string
  /** The wording of the link. */
  action: string
}

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
