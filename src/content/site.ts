/*
 * PRAAMIX site content
 *
 * All editable copy, media paths, contact details and external links are in
 * this file. Changing them never needs a layout change.
 *
 *   - Leave a field empty ('' or []) and the site leaves that element out.
 *     It never shows a dead button or an empty link.
 *   - Leave `image: null` and the frame shows a labelled placeholder rather
 *     than passing anything off as game footage.
 *   - Only add store links, contact details and dates that are real.
 *
 * The shapes these entries follow are in types.ts. The README explains how to
 * add images. Keep this file to plain data: the build reads it too.
 */
import type { ExternalLink, Game } from './types.ts'

export type { ExternalLink, Game, GameImage, ImageCrop, MediaSlot } from './types.ts'

export function gamePath(game: { slug: string }): string {
  return `/games/${game.slug}`
}

/* ---------- Games ---------- */

export const sheriffTownVr: Game = {
  slug: 'sheriff-town-vr',
  title: 'Sheriff Town VR',
  accentWord: 'VR',
  status: 'In development',
  summary:
    'A VR sandbox set in a town where you’re the sheriff. Physical interactions, room to experiment, and a job built around arrests and non-lethal takedowns.',
  standfirst: 'You’re the sheriff of a town you can put your hands on.',
  intro: [
    'Sheriff Town VR is a virtual reality game set in a town. You play its sheriff.',
    'It’s a sandbox built on physical interaction, with room to experiment. Arrests and non-lethal takedowns are central to it.',
  ],
  identityHeading: 'What it is',
  identity: [
    {
      title: 'The town',
      body: 'The game is set in a town. It’s the place you look after, and the place you get to play in.',
    },
    {
      title: 'Hands on',
      body: 'Interactions are physical. The town is something you handle, not something you only look at.',
    },
    {
      title: 'Sandbox',
      body: 'There’s room to experiment. Try something, see what happens, then try something else.',
    },
    {
      title: 'Bring them in',
      body: 'Arrests and non-lethal takedowns are at the centre of the game. Being sheriff here means bringing people in.',
      key: true,
    },
  ],
  media: {
    feature: { label: 'Sheriff Town VR, featured image', image: null },
    hero: { label: 'Sheriff Town VR, main visual', image: null },
    pendingNote:
      'No screenshots or footage yet. The frame above is a placeholder, not an image from the game.',
    gallery: [],
  },
  development: {
    heading: 'Where it stands',
    facts: [
      { term: 'Status', detail: 'In development' },
      { term: 'Development targets', detail: 'Standalone and PC VR' },
      { term: 'Release date', detail: 'Not announced' },
    ],
    note: 'Development targets are the platforms the game is being built for, not a list of supported headsets. That list hasn’t been announced.',
  },
  storeLinks: [],
}

/** Homepage order. The first game is the one the opening button links to. */
export const games: Game[] = [sheriffTownVr]

/* ---------- Studio ---------- */

export const site = {
  name: 'Praamix',
  /** Set in the masthead. The second A is the letter that leans. */
  wordmark: 'PRAAMIX',
  descriptor: 'Independent game studio',
  /** Used for search engines and link previews. */
  description:
    'Praamix is an independent game studio. Its first game, Sheriff Town VR, is in development.',

  nav: [
    { label: 'Games', to: '/#games', section: '/games' },
    { label: 'Studio', to: '/#studio', section: '' },
    { label: 'Contact', to: '/#contact', section: '' },
  ],

  home: {
    hero: {
      statement: 'One game in the works. You play the sheriff.',
      actionLabel: 'Sheriff Town VR',
    },
    games: {
      heading: 'Games',
      actionLabel: 'About the game',
    },
    studio: {
      heading: 'Studio',
      lead: 'Praamix is an independent game studio.',
      body: [
        'Its first game, Sheriff Town VR, is in development.',
        'There isn’t much to show yet, and this site won’t pretend otherwise. When there’s real footage, it goes here.',
      ],
    },
  },

  gamePage: {
    crumb: 'Games',
    introHeading: 'The game',
    galleryHeading: 'Gallery',
    storesHeading: 'Where to get it',
    closingLabel: 'Back to the studio',
    backLabel: 'Back to Praamix',
  },

  /** The large line that closes both pages. */
  closingLine: 'More when there’s more to show.',

  contact: {
    heading: 'Contact',
    /** A real address only, e.g. 'hello@example.com'. Empty hides the link. */
    email: '',
    /** Real profiles only, e.g. { label: 'YouTube', url: 'https://…' }. */
    links: [] as ExternalLink[],
    /** Shown only while both fields above are empty. */
    emptyNote: 'Contact details aren’t published yet. They’ll be listed here when they are.',
  },

  footer: {
    note: 'Sheriff Town VR is in development.',
  },

  /** Margin note shown on very wide screens. */
  rail: 'In development: Sheriff Town VR',

  notFound: {
    title: 'Nothing at this address.',
    actionLabel: 'Back to Praamix',
  },
}
