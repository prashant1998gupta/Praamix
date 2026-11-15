/*
 * The pictures the site uses: what each one shows and how it is labelled.
 *
 * Every illustration is generated studio artwork. None is a screenshot of a
 * game or a piece of client work, and the captions say so. Replace an entry
 * when real media exists, and change its caption to match.
 */
import { media } from './media.generated.ts'
import type { SiteImage } from './types.ts'

const STUDIO = 'Studio illustration'
const CONCEPT = 'Concept illustration — not gameplay'

export const images = {
  worldBuilding: {
    file: media['world-building'],
    alt: 'A hand lowering a stone arch into a miniature game world, beside a pencil sketch of the same scene and three material samples.',
    caption: STUDIO,
    tone: '#fbf7f8',
  },
  artSequence: {
    file: media['art-sequence'],
    alt: 'A small off-road car shown four times: as a pencil sketch, as a wireframe, as a finished model, and placed into a miniature scene.',
    caption: 'Studio illustration — art production sequence',
    tone: '#f2eced',
  },
  deviceFamily: {
    file: media['device-family'],
    alt: 'Unbranded devices: a monitor, a phone, a tablet, a handheld console, a game controller and a VR headset with two hand controllers.',
    caption: 'Studio illustration. The screens show made-up artwork, not a released game.',
    tone: '#fefefe',
  },
  characterStudy: {
    file: media['character-study'],
    alt: 'A toy-like robot in three forms: concept drawings on an easel, a finished painted model, and a grey wireframe figure posed mid-run.',
    caption: 'Studio illustration. The robot is an example subject, not an announced character.',
    tone: '#f8f3f3',
  },
  townInHands: {
    file: media['town-in-hands'],
    alt: 'A miniature town held in two hands, with a domed building marked by a gold star, shops, trees and a small orange car.',
    caption: CONCEPT,
    tone: '#ebe0da',
  },
  townTree: {
    file: media['town-tree'],
    alt: 'A hand placing a tree into a miniature street, next to a star-marked building, a shop with a striped awning and an orange car.',
    caption: STUDIO,
    tone: '#e8e2e3',
  },
  townCentre: {
    file: media['town-detail-centre'],
    alt: 'Close-up of the model town: a domed building with a gold star above its door.',
    caption: CONCEPT,
    tone: '#ebe0da',
  },
  townHands: {
    file: media['town-detail-hands'],
    alt: 'Close-up of the model town: a hand gripping the edge of the base, beside a tree and a park bench.',
    caption: CONCEPT,
    tone: '#ebe0da',
  },
  townStreet: {
    file: media['town-detail-street'],
    alt: 'Close-up of the model town: a small orange car on the street beside a pedestrian crossing.',
    caption: CONCEPT,
    tone: '#ebe0da',
  },
} satisfies Record<string, SiteImage>

export type ImageName = keyof typeof images

/*
 * How wide each picture is drawn at each screen size, so the browser can fetch
 * a file to suit. Keep in step with the stylesheets.
 */
export const SIZES = {
  /** The picture at the top of a page, and the game feature on the homepage. */
  hero: '(min-width: 120em) 860px, (min-width: 86em) 700px, (min-width: 56em) 54vw, 94vw',
  /** A picture beside text further down a page. */
  half: '(min-width: 120em) 840px, (min-width: 86em) 670px, (min-width: 56em) 52vw, 94vw',
  /** The close-ups in the chapters. */
  panel: '(min-width: 120em) 770px, (min-width: 86em) 615px, (min-width: 56em) 47vw, 94vw',
  /** A picture that runs the full width of the page. */
  wide: '(min-width: 120em) 1600px, (min-width: 86em) 1280px, 94vw',
}
