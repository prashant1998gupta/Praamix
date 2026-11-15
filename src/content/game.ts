/*
 * Sheriff Town VR.
 *
 * Only confirmed facts belong here. Leave a list empty and the page leaves
 * that part out: no store links means no store buttons, no gallery images
 * means no gallery. Never add a price, date, headset or store that is not real.
 */
import type { ImageName } from './images.ts'
import type { ExternalLink, Faq, SiteImage, StoreEntry } from './types.ts'

type Fact = { term: string; detail: string }

type Chapter = {
  id: string
  label: string
  title: string
  body: string[]
  /** A close-up from the concept illustration. See images.ts. */
  image: ImageName
}

const glance: Fact[] = [
  { term: 'Kind of game', detail: 'VR sandbox set in a town' },
  { term: 'You play', detail: 'The sheriff' },
  {
    term: 'What you do',
    detail: 'Handle the world physically, experiment, and bring people in through arrests and non-lethal takedowns',
  },
  { term: 'Status', detail: 'In development' },
  { term: 'Development targets', detail: 'Standalone VR and PC VR' },
  { term: 'Release date', detail: 'Not announced' },
]

const chapters: Chapter[] = [
  {
    id: 'world',
    label: 'The world',
    title: 'A town, and you’re its sheriff.',
    body: [
      'Sheriff Town VR is set in a town. It’s the place you look after, and the place you get to play in.',
      'Keeping the peace means bringing people in, through arrests and non-lethal takedowns.',
    ],
    image: 'townCentre',
  },
  {
    id: 'interactions',
    label: 'The interactions',
    title: 'Reach in and use your hands.',
    body: ['Interaction is physical. The town is something you handle, not something you only look at.'],
    image: 'townHands',
  },
  {
    id: 'experiments',
    label: 'The experiments',
    title: 'Try it and see what happens.',
    body: ['It’s a sandbox with room to experiment. Try something, see what happens, then try something else.'],
    image: 'townStreet',
  },
]

const faq: Faq[] = [
  {
    question: 'When does it come out?',
    answer: 'No release date has been announced.',
  },
  {
    question: 'Which headsets will it support?',
    answer:
      'The game is being developed for standalone and PC VR. A list of supported headsets has not been announced.',
  },
  {
    question: 'Where can I buy it?',
    answer:
      'It isn’t on sale yet, and no store listing has been announced. When there is one, this page will link to it.',
  },
  {
    question: 'How will I install it and get support?',
    answer:
      'That depends on the store the game is released through, so those details will be added here once the store is known.',
  },
]

export const sheriffTownVr = {
  slug: 'sheriff-town-vr',
  title: 'Sheriff Town VR',
  label: 'A Praamix original',
  status: 'In development',
  tagline: ['A town to explore.', 'A sheriff to become.'],
  summary:
    'A VR sandbox set in a town where you play the sheriff. Handle the world with your own hands, experiment, and bring people in through arrests and non-lethal takedowns.',

  glanceHeading: 'At a glance.',
  glance,
  /** Add confirmed details only, e.g. { term: 'Age rating', detail: '…' }. */
  confirmed: [] as Fact[],

  chaptersHeading: 'What the game is built around.',
  chapters,

  development: {
    heading: 'Where development stands.',
    note: 'Development targets are the platforms the game is being built for. They are not a list of supported headsets, and they don’t promise a release on a particular store.',
  },

  availability: {
    heading: 'Where to get it.',
    none: 'Sheriff Town VR isn’t on sale yet, and no store listing has been announced. When one exists, the link will be here.',
  },
  /** Real store pages only. See StoreEntry in types.ts. */
  stores: [] as StoreEntry[],
  /** A real page where players can follow the game, such as a community or newsletter. */
  updates: null as ExternalLink | null,
  /** A real trailer. It opens on the video site, not inside this page. */
  trailer: null as ExternalLink | null,

  galleryHeading: 'From the game.',
  /** Genuine screenshots only. The gallery appears when this list has entries. */
  gallery: [] as SiteImage[],

  faqHeading: 'Player questions.',
  faq,

  closing: {
    title: 'See the rest of Praamix.',
    text: 'The studio behind the game, and the people in it.',
    action: 'Back to Praamix',
  },
}

export const games = [sheriffTownVr]

export function gamePath(game: { slug: string }): string {
  return `/games/${game.slug}`
}
