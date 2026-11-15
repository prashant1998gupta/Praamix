/*
 * The pictures the site uses: what each one shows and how it is labelled.
 *
 * Two kinds:
 *   - Studio illustrations: generated artwork for the services and studio
 *     pages. Not a game, not client work, and the captions say so.
 *   - In-game captures of Sheriff Town VR, rendered in Unity from the game's
 *     own scenes. The game is in development, so the captions say that too.
 */
import { media } from './media.generated.ts'
import type { SiteImage } from './types.ts'

const STUDIO = 'Studio illustration'
const CAPTURE = 'In-game capture · in development'
const MAP = 'The game’s Dispatch board picture of this map'
const RENDER = 'In-engine render of in-game models, set on a studio backdrop · in development'

export const images = {
  /* ---------- Studio illustrations ---------- */
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
  townTree: {
    file: media['town-tree'],
    alt: 'A hand placing a tree into a miniature street, next to a star-marked building, a shop with a striped awning and an orange car.',
    caption: STUDIO,
    tone: '#e8e2e3',
  },

  /* ---------- Sheriff Town VR: in-game captures ---------- */
  stvArrival: {
    file: media['stv-arrival'],
    alt: 'The Sheriff Town police precinct under a blue sky: a brick station with a clock tower and a sign reading Sheriff Town, a Dispatch board at its door, a patrol car, a deputy and a gold star painted on the plaza.',
    caption: CAPTURE,
    tone: '#9cc3e8',
  },
  stvLineup: {
    file: media['stv-lineup'],
    alt: 'Five townspeople standing on numbered spots in front of a height chart headed Sheriff Town PD Lineup.',
    caption: CAPTURE,
    tone: '#bcd4ec',
  },
  stvFunCourt: {
    file: media['stv-fun-court'],
    alt: 'Townspeople and two officers on a blue sports court below a sign reading Fun Court, with benches and apartment blocks behind.',
    caption: CAPTURE,
    tone: '#b6cfe9',
  },
  stvDistrict: {
    file: media['stv-district'],
    alt: 'An aerial view of the precinct district: the station, its yards and courts, a lineup wall, and traffic on the surrounding roads.',
    caption: CAPTURE,
    tone: '#c9d5e0',
  },
  stvExperiments: {
    file: media['stv-experiments'],
    alt: 'A man in an orange jumpsuit in a walled yard below a sign reading Experiments, with stacked crates and gadgets on lit pedestals.',
    caption: CAPTURE,
    tone: '#c3d8ee',
  },
  stvShop: {
    file: media['stv-shop'],
    alt: 'A woman at a food counter marked Shop and Fresh Today, with fruit on the counter and a hen at her feet.',
    caption: CAPTURE,
    tone: '#bfd5ea',
  },
  stvArmory: {
    file: media['stv-armory'],
    alt: 'Two display tables under a board reading Armory, Pick One Up, laid out with tools and weapons.',
    caption: CAPTURE,
    tone: '#c8d6e4',
  },
  stvBottleTrap: {
    file: media['stv-bottle-trap'],
    alt: 'A townsman standing trapped inside a giant glass bottle with his arms raised, in an open test yard.',
    caption: CAPTURE,
    tone: '#d7dfe6',
  },
  stvToolGuns: {
    file: media['stv-tool-guns'],
    alt: 'Fourteen brightly coloured tool guns in three rows on a dark backdrop, each a different shape and colour.',
    caption: RENDER,
    tone: '#222c3a',
  },
  stvPhysicsTools: {
    file: media['stv-physics-tools'],
    alt: 'Eight workshop physics tools on a dark backdrop: a thruster, a motor, a piston, a propeller, a stabilizer, a red balloon, a climbing grip and a lever.',
    caption: RENDER,
    tone: '#222c3a',
  },
  stvFort: {
    file: media['stv-fort'],
    alt: 'A two-storey timber fort on a sandstone base, with stairs, a balcony, a gate and a ramp, built from snap-together pieces.',
    caption: RENDER,
    tone: '#222c3a',
  },

  /* ---------- Sheriff Town VR: the Dispatch board's map pictures ---------- */
  mapPoliceStation: {
    file: media['map-police-station'],
    alt: 'The police station seen from above: a brick building with flags, a car park, trees and townhouses behind.',
    caption: MAP,
    tone: '#a9c4dd',
  },
  mapGroceryStore: {
    file: media['map-grocery-store'],
    alt: 'A grocery store with a car park full of cars, on a green plain by a road.',
    caption: MAP,
    tone: '#9fb8c7',
  },
  mapRooftopRestaurant: {
    file: media['map-rooftop-restaurant'],
    alt: 'A restaurant on a city rooftop at night, with lit windows in the towers around it.',
    caption: MAP,
    tone: '#2d2a33',
  },
  mapFunRanch: {
    file: media['map-fun-ranch'],
    alt: 'An island park seen from above: water slides, a pool, a speedway, a farm and fields beside the sea.',
    caption: MAP,
    tone: '#7fa36b',
  },
  mapRattlesnakeDen: {
    file: media['map-rattlesnake-den'],
    alt: 'Inside the gang’s den: a saloon floor with a bar, card tables, barred gates and a painted mural on the wall.',
    caption: MAP,
    tone: '#c79d6a',
  },
  mapColourBridge: {
    file: media['map-colour-bridge'],
    alt: 'Two tall towers joined high up by a bridge of coloured tiles.',
    caption: MAP,
    tone: '#dfe7f3',
  },
} satisfies Record<string, SiteImage>

export type ImageName = keyof typeof images

/*
 * How wide each picture is drawn at each screen size, so the browser can fetch
 * a file to suit. Keep in step with the stylesheets.
 */
export const SIZES = {
  /** The picture at the top of a page. */
  hero: '(min-width: 120em) 860px, (min-width: 86em) 700px, (min-width: 56em) 54vw, 94vw',
  /** The full-width game picture at the top of the homepage and the game page. */
  stage: '(min-width: 86em) 1280px, 96vw',
  /** A picture beside text further down a page. */
  half: '(min-width: 120em) 840px, (min-width: 86em) 670px, (min-width: 56em) 52vw, 94vw',
  /** The picture in a card of three or four. */
  card: '(min-width: 86em) 420px, (min-width: 56em) 30vw, (min-width: 40em) 46vw, 94vw',
  /** A picture that runs the full width of the page. */
  wide: '(min-width: 120em) 1600px, (min-width: 86em) 1280px, 94vw',
}
