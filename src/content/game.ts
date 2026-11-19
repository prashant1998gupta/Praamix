/*
 * Sheriff Town VR.
 *
 * Written from the game's own design documents, story scripts and scenes,
 * reviewed 15 November 2026. Only what is built in the game belongs here, and
 * the game is in development, so details can still change.
 *
 * Leave a list empty and the page leaves that part out: no store links means
 * no store buttons. Never add a price, date, headset or store that is not real.
 */
import { images } from './images.ts'
import { media } from './media.generated.ts'
import { channels } from './site.ts'
import type { Channel, ExternalLink, Faq, Poster, SiteImage, StoreEntry, Trailer } from './types.ts'

type Fact = { term: string; detail: string }

/** A short card on the homepage, pointing at one part of the game. */
type Pillar = { id: string; title: string; text: string; image: SiteImage }

/** A section of the game page: a picture beside what it shows. */
type Feature = {
  id: string
  eyebrow: string
  title: string
  body: string[]
  points: string[]
  image: SiteImage
}

/** One story in the game, shown as a case file. */
type CaseFile = { id: string; title: string; where: string; hook: string; detail: string }

/** One voiced line from the game's scripts, and who says it. */
type Line = { line: string; who: string; where: string }

export type Mode = 'sandbox' | 'challenge'

/** One map on the game's Dispatch board, with the name the board gives it. */
export type GameMap = {
  id: string
  name: string
  mode: Mode
  story?: string
  summary: string
  highlights: string[]
  image: SiteImage
}

const glance: Fact[] = [
  { term: 'Kind of game', detail: 'VR sandbox with stories and challenges' },
  { term: 'You play', detail: 'The town’s sheriff' },
  {
    term: 'How you police',
    detail: 'Non-lethal takedowns and arrests. The game is designed so that killing is never the efficient route.',
  },
  { term: 'Where you go', detail: 'Five sandbox maps and two challenge maps, chosen from the precinct’s Dispatch board' },
  { term: 'Voices', detail: 'Every story line is voiced, each character in their own voice' },
  { term: 'Multiplayer', detail: 'Planned. The game is single-player today.' },
  { term: 'Status', detail: 'In development' },
  { term: 'Development targets', detail: 'Standalone VR and PC VR' },
  { term: 'Release date', detail: 'Not announced' },
]

const pillars: Pillar[] = [
  {
    id: 'arrests',
    title: 'Bring them in alive.',
    text: 'Takedowns drain a suspect’s stun, not their health. Put them down, cuff them, walk them in.',
    image: images.stvLineup,
  },
  {
    id: 'town',
    title: 'A town that talks back.',
    text: 'Clerks, chefs, joggers and a gran with a pie in her handbag. Everyone has something to say, out loud.',
    image: images.stvFunCourt,
  },
  {
    id: 'tools',
    title: 'Bend the rules.',
    text: 'Portal, gravity, ice and bubble guns, thrusters and balloons. And a bottle you can keep a man in.',
    image: images.stvToolGuns,
  },
  {
    id: 'build',
    title: 'Build it, then ride it.',
    text: 'Snap together a frontier fort, or bolt wheels to a seat and drive away in it.',
    image: images.stvFort,
  },
]

const features: Feature[] = [
  {
    id: 'arrests',
    eyebrow: 'The job',
    title: 'Bring them in alive.',
    body: [
      'Sheriff Town is built around the arrest, not the kill. Non-lethal hits drain a person’s stun until they go down. Then the cuffs go on and their hands go behind their back.',
      'Your kit is physical. Handcuffs that open and close, a taser you reload by hand, an expandable baton you flick open. There are firearms in the armory, but in this town, killing is a failure, not a shortcut. The statue of the first sheriff says it plainly: he brought them in alive.',
    ],
    points: [
      'Stun before health',
      'Cuff anyone you take down',
      'People surrender, run or fight back',
      'Freeze someone solid, then cuff the statue',
    ],
    image: images.stvLineup,
  },
  {
    id: 'town',
    eyebrow: 'The people',
    title: 'A town that talks back.',
    body: [
      'Walk into the Quick Stop and the clerk asks whether you’re buying or robbing. A pensioner wants the prices arrested. A skater with no board, a jogger who never stops, a street magician and the town drunk doing laps of the plaza: everybody has a complaint, a scheme or a confession for the Sheriff.',
      'Every line is voiced, each person in their own voice, and the houses have people in them too. The dogs come over to be petted, and follow you if you do it properly. The cats put up with you for a while.',
    ],
    points: ['Fully voiced stories', 'Homes with people inside', 'Dogs, cats, sheep and hens', 'Feed anyone from the Food Gun'],
    image: images.stvFunCourt,
  },
  {
    id: 'tools',
    eyebrow: 'The toolbox',
    title: 'Bend the rules of physics.',
    body: [
      'The Spawn Gun puts props, people, weapons and vehicles wherever you point it. Then the tool guns take over: Gravity, Portal, Ice, Bubble, Size, Copy-Paste, Food, Scanner, Connection and Modification.',
      'The physics tools turn anything into a machine. Thrusters, propellers, balloons, motors, pistons and stabilizers bolt onto whatever you like, and run from remotes, levers and buttons.',
    ],
    points: ['Fourteen tool guns', 'Machines from physics tools', 'Remotes, levers and switches', 'Save a build as a blueprint'],
    image: images.stvPhysicsTools,
  },
  {
    id: 'build',
    eyebrow: 'The workshop',
    title: 'Build it. Then ride it.',
    body: [
      'Snap together a frontier fort from timber, sandstone and iron: foundations, walls, stairs, roofs, gates and jail bars.',
      'Bolt wheels, a seat and a steering wheel together, sit down, and drive it. Or take the ATV, the jetpack, a jet ski or one of the town’s cars.',
    ],
    points: ['A frontier build kit', 'Cars built from parts', 'ATV, jetpack and jet ski', 'Drivable town cars'],
    image: images.stvFort,
  },
]

const cases: CaseFile[] = [
  {
    id: 'glazed',
    title: 'The Great Glazed Heist',
    where: 'Police Station',
    hook: 'The Chief’s box of twelve golden glazed donuts vanished overnight, two days before the bake-off.',
    detail: 'Everybody has a theory. Rico is in Interrogation, because Rico is always in Interrogation.',
  },
  {
    id: 'cheese',
    title: 'The Big Cheese Heist',
    where: 'Grocery Store',
    hook: 'Big Bertha, a forty-kilo wheel of prize cheddar, is gone from the cold store before the County Cheese Festival.',
    detail: 'Only the manager has the key. The health inspector is visiting today.',
  },
  {
    id: 'birthday',
    title: 'Big Sal’s Birthday',
    where: 'Rattlesnake Den',
    hook: 'The Rattlesnakes are throwing their boss a fiftieth birthday party, with kidnapped guests.',
    detail: 'Free the hostages, take your Golden Star from the vault, and arrest the birthday boy.',
  },
]

const overheard: Line[] = [
  {
    line: 'Welcome to Quick Stop! Are you buying, or robbing? Either way, smile for the camera!',
    who: 'Sally',
    where: 'the Quick Stop clerk',
  },
  {
    line: 'Sheriff! Arrest these prices! Four dollars for water! In my day, water fell from the sky. For free!',
    who: 'Walt',
    where: 'a Quick Stop customer',
  },
  {
    line: 'Hello, dear! They kidnapped me on Tuesday. So far I’ve won their car, their watches and Two-Bit’s trousers.',
    who: 'Granny Mary',
    where: 'a hostage at the poker table',
  },
  {
    line: 'She’s not expired. She’s VINTAGE.',
    who: 'Gloria',
    where: 'the grocery store manager',
  },
  {
    line: 'I’m a dentist! They kidnapped me to polish his gold tooth! It’s not even gold! It’s a painted peanut!',
    who: 'Doc',
    where: 'a hostage at the den',
  },
  {
    line: 'Table for one, Sheriff? Or is this a stakeout? We do stakeout portions.',
    who: 'Sally',
    where: 'the host at The Rooftop',
  },
  {
    line: 'Keep your guard up, Meatball! Chin down! No, your chin! Not his!',
    who: 'Coach Pops',
    where: 'in the den’s boxing ring',
  },
  {
    line: 'You didn’t bring a present, so I’ll assume the present is you leaving.',
    who: 'Big Sal',
    where: 'the birthday boy',
  },
]

const maps: GameMap[] = [
  {
    id: 'police-station',
    name: 'Police Station',
    mode: 'sandbox',
    story: 'The Great Glazed Heist',
    summary:
      'The station has lost the Chief’s donuts, and the town outside has opinions. Walk the streets, knock on doors, and find out who has glaze on their whiskers.',
    highlights: ['A station full of suspects', 'About twenty voiced townspeople', 'Homes, a bakery that never bakes, a gang card game'],
    image: images.mapPoliceStation,
  },
  {
    id: 'grocery-store',
    name: 'Grocery Store',
    mode: 'sandbox',
    story: 'The Big Cheese Heist',
    summary:
      'Sheriff Mart’s prize cheddar is missing and the festival is in two days. Staff and shoppers each saw something. The crumbs lead somewhere.',
    highlights: ['Clues from staff and shoppers', 'Traffic and a crowd outside', 'Day and night lighting'],
    image: images.mapGroceryStore,
  },
  {
    id: 'rooftop-restaurant',
    name: 'Rooftop Restaurant',
    mode: 'sandbox',
    story: 'A night out',
    summary:
      'No case tonight. Twenty diners above the city lights, a host who works the Quick Stop by day, and conversations worth listening in on.',
    highlights: ['A night above the city', 'Twenty diners, ten of them talking', 'The town’s faces, off duty'],
    image: images.mapRooftopRestaurant,
  },
  {
    id: 'fun-ranch',
    name: 'Fun Ranch',
    mode: 'sandbox',
    summary:
      'An island built for messing about: a water tower and slides, six ziplines, a midway with a high striker and a dunk tank, a lakeside pier, a farm, a speedway and a human cannon.',
    highlights: ['Ziplines and water slides', 'A midway and a speedway', 'A human cannon'],
    image: images.mapFunRanch,
  },
  {
    id: 'rattlesnake-den-sandbox',
    name: 'Rattlesnake Den',
    mode: 'sandbox',
    story: 'Big Sal’s Birthday',
    summary:
      'The gang is home for the party and starts nothing. Free the kidnapped guests, get in the ring with the sparring partners, and arrest the birthday boy.',
    highlights: ['Four hostages to free', 'A boxing ring', 'Fully voiced, room by room'],
    image: images.mapRattlesnakeDen,
  },
  {
    id: 'rattlesnake-den-challenge',
    name: 'The Rattlesnake Den',
    mode: 'challenge',
    summary:
      'Bust the den. Six gated rooms, waves of gangsters, a vault with something of yours inside, and a timed escape.',
    highlights: ['Six rooms behind gates', 'Waves to survive', 'Your best time is kept'],
    image: images.mapRattlesnakeDen,
  },
  {
    id: 'colour-bridge',
    name: 'The Colour Bridge',
    mode: 'challenge',
    summary: 'A timed crossing of coloured tiles strung between two very tall towers. Read the colours, keep your feet, beat the clock.',
    highlights: ['Eight tile colours', 'A long way down', 'Against the clock'],
    image: images.mapColourBridge,
  },
]

/** One model in the 3D rack: a transparent cut-out from the game's renders. */
export type RackItem = { id: string; name: string; text: string; image: SiteImage }

const cutout = (key: keyof typeof media, name: string): SiteImage => ({
  file: media[key],
  alt: name,
  caption: 'In-engine render of the in-game model · in development',
  tone: 'transparent',
})

const guns: RackItem[] = [
  { id: 'spawn', name: 'Spawn Gun', text: 'Puts props, people, weapons and vehicles wherever you point it.', image: cutout('gun-spawn', 'Spawn Gun') },
  { id: 'physics', name: 'Physics Gun', text: 'Picks things up at a distance and holds them where you like.', image: cutout('gun-physics', 'Physics Gun') },
  { id: 'gravity', name: 'Gravity Gun', text: 'Pull it in, hold it, then punt it down the street.', image: cutout('gun-gravity', 'Gravity Gun') },
  { id: 'portal', name: 'Portal Gun', text: 'Two doors, one space.', image: cutout('gun-portal', 'Portal Gun') },
  { id: 'ice', name: 'Ice Gun', text: 'Freezes a person into a statue you can cuff.', image: cutout('gun-ice', 'Ice Gun') },
  { id: 'bubble', name: 'Bubble Gun', text: 'Anything it touches floats off in a bubble.', image: cutout('gun-bubble', 'Bubble Gun') },
  { id: 'size', name: 'Size Gun', text: 'Grows things, or shrinks them. People included.', image: cutout('gun-size', 'Size Gun') },
  { id: 'copypaste', name: 'Copy-Paste Gun', text: 'Copies a contraption and pastes it again, as a blueprint.', image: cutout('gun-copypaste', 'Copy-Paste Gun') },
  { id: 'food', name: 'Food Gun', text: 'Lunch, a sting, or bait for the town’s dogs.', image: cutout('gun-food', 'Food Gun') },
  { id: 'scanner', name: 'Scanner Gun', text: 'Reads anything you point it at.', image: cutout('gun-scanner', 'Scanner Gun') },
  { id: 'joint', name: 'Joint Gun', text: 'Welds, hinges, ropes or springs any two things together.', image: cutout('gun-joint', 'Joint Gun') },
  { id: 'harpoon', name: 'Harpoon Gun', text: 'Hooks something and reels it in.', image: cutout('gun-harpoon', 'Harpoon Gun') },
  { id: 'connection', name: 'Connection Gun', text: 'Wires a remote, trigger or tool to the thing it drives.', image: cutout('gun-connection', 'Connection Gun') },
  { id: 'modification', name: 'Modification Gun', text: 'Changes anything, from a panel on your other hand.', image: cutout('gun-modification', 'Modification Gun') },
]

const tools: RackItem[] = [
  { id: 'thruster', name: 'Thruster', text: 'Pushes whatever it is bolted to. People included.', image: cutout('tool-thruster', 'Thruster') },
  { id: 'propeller', name: 'Propeller', text: 'Lifts what it is bolted to. Enough of them fly a person.', image: cutout('tool-propeller', 'Propeller') },
  { id: 'motor', name: 'Motor', text: 'Turns whatever is set on it, round and round.', image: cutout('tool-motor', 'Motor') },
  { id: 'piston', name: 'Piston', text: 'Pushes out and pulls back, when you say so.', image: cutout('tool-piston', 'Piston') },
  { id: 'balloon', name: 'Balloon', text: 'Ties itself on a string where you set it down, and lifts.', image: cutout('tool-balloon', 'Balloon') },
  { id: 'stabilizer', name: 'Stabilizer', text: 'Keeps a build upright, whatever it weighs.', image: cutout('tool-stabilizer', 'Stabilizer') },
  { id: 'climbinggrip', name: 'Climbing Grip', text: 'Fix it to a wall, grab it, and climb.', image: cutout('tool-climbinggrip', 'Climbing Grip') },
  { id: 'lever', name: 'Lever', text: 'Ten steps from off to full power, for anything wired to it.', image: cutout('tool-lever', 'Lever') },
]

const extras = [
  'Uncork the containment bottle and the nearest person is drawn inside, a hand’s height tall. Cork it to keep them.',
  'Hold a button and the revolver spins around your trigger finger, then lands back in your grip.',
  'Jailbreak: prisoners run for their own hiding places. Catch them and they go back behind bars.',
  'Slow motion is one button away.',
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
    question: 'Do I have to fight?',
    answer:
      'Not much. The game is built around arrests: non-lethal takedowns, cuffs and the taser. The sandbox maps have no clock and no fail state. Firearms exist, but the game is designed so that killing is never the efficient route.',
  },
  {
    question: 'Is there a story?',
    answer:
      'Several. Most sandbox maps have their own cast and their own story, fully voiced, and the town’s faces turn up from one map to the next.',
  },
  {
    question: 'Will it have multiplayer?',
    answer:
      'Yes, multiplayer is planned. It is not in the game yet, and we have not announced how it will work or when it will arrive.',
  },
  {
    question: 'Where can I follow the game?',
    answer:
      'On the Sheriff Town VR Discord server and on the game’s YouTube channel, where the trailer is. Both are linked on this page.',
  },
  {
    question: 'Where can I buy it?',
    answer:
      'It isn’t on sale yet, and no store listing has been announced. When there is one, this page will link to it.',
  },
  {
    question: 'Where do I get help with the game?',
    answer:
      'On the player support page, praamix.com/support. It has comfort settings, answers to common questions, and how to reach us by email or on Discord.',
  },
]

/* Key art made for the game. The names and places are the ones the artwork was made under. */
const posters: Poster[] = [
  { id: 'bubbles', title: 'Bubbles', place: 'Police Station', image: images.posterBubbles },
  { id: 'bottles', title: 'Bottles', place: 'Police Station', image: images.posterBottles },
  { id: 'builds', title: 'Builds', place: 'The street', image: images.posterBuilds },
  { id: 'giant-animals', title: 'Giant animals', place: 'The street', image: images.posterGiantAnimals },
  { id: 'weapons', title: 'Weapons', place: 'The station wall', image: images.posterWeapons },
  { id: 'chaos', title: 'Chaos', place: 'The street', image: images.posterChaos },
  { id: 'arrest', title: 'Arrest', place: 'Police Station', image: images.posterArrest },
  { id: 'explosion', title: 'Explosion', place: 'The gas station', image: images.posterExplosion },
  { id: 'animals', title: 'Animals', place: 'Fountain park', image: images.posterAnimals },
  { id: 'party', title: 'Party', place: 'The rooftop', image: images.posterParty },
  { id: 'gravity-gun', title: 'Gravity Gun', place: 'Grocery Store', image: images.posterGravityGun },
  { id: 'lake', title: 'Lake', place: 'Fun Ranch', image: images.posterLake },
]

export const sheriffTownVr = {
  slug: 'sheriff-town-vr',
  title: 'Sheriff Town VR',
  label: 'A Praamix original',
  status: 'In development',
  motto: 'Bring them in alive.',
  summary:
    'A VR sandbox where you are the sheriff of a town that talks back. Hear out its people, untangle its mysteries, bend its physics, and bring everyone in alive.',
  heroImage: images.stvArrival,
  logo: images.stvLogo,
  drum: images.stvDrum,

  /*
   * The slideshow that opens the homepage: the in-game capture first, then
   * the key art. The capture has no logo of its own, so the site lays the
   * logo over it. The posters carry theirs.
   */
  marquee: {
    label: 'Sheriff Town VR in pictures',
    capture: { title: 'The precinct', place: 'In-game capture' },
    posterKind: 'Key art',
    posters,
  },
  keyArtHeading: 'Key art.',
  keyArtLede: 'Posters made for the game. They are artwork, not captures from it. Select one to see it larger.',

  glanceHeading: 'At a glance.',
  glance,
  /** Add confirmed details only, e.g. { term: 'Age rating', detail: '…' }. */
  confirmed: [] as Fact[],

  pillars,
  features,

  casesHeading: 'A mystery at every address.',
  casesLede: 'Each place has its own people and its own story. You piece it together by talking to them.',
  cases,

  overheard: {
    heading: 'Overheard in Sheriff Town.',
    lede: 'Real lines from the game’s scripts. Every one is voiced.',
    action: 'Hear another',
    lines: overheard,
  },

  dispatch: {
    heading: 'Pick a map.',
    lede: 'Every shift starts at the precinct, where the Dispatch board sends you out.',
    modes: {
      sandbox: { label: 'Sandbox', text: 'No clock and no fail state. Wander, talk, experiment.' },
      challenge: { label: 'Challenge', text: 'A goal, a clock and a best time to beat.' },
    } satisfies Record<Mode, { label: string; text: string }>,
    maps,
  },

  /** Real counts from the game, shown in the strip under the opening. */
  stats: [
    { value: 7, suffix: '', label: 'maps to patrol' },
    { value: 14, suffix: '', label: 'tool guns' },
    { value: 300, suffix: '+', label: 'voiced story lines' },
    { value: 2, suffix: '', label: 'ways to play: sandbox and challenge' },
  ],

  /** Words that run along the moving strip. */
  ticker: [
    'Arrests, not kills',
    'A town that talks back',
    'The Great Glazed Heist',
    'Portal Gun',
    'Ice them, then cuff them',
    'Big Sal’s birthday',
    'Build a fort',
    'Ride the ATV',
    'The human cannon',
    'The Colour Bridge',
    'Put a man in a bottle',
    'Multiplayer on the way',
  ],

  showroom: {
    heading: 'The Sheriff’s kit, in your hands.',
    lede: 'These are the game’s real models, running live in your browser. Pick a tool gun and turn it over.',
    guns,
    toolsLabel: 'And the physics tools that go with them',
    tools,
  },

  /** Planned, by the studio's own word. Nothing here describes how it will work. */
  multiplayer: {
    status: 'Planned',
    heading: 'Deputies wanted.',
    body: [
      'Multiplayer is coming to Sheriff Town VR.',
      'It is planned, not playable yet. We will show how it works, and how many sheriffs one town can take, when it is ready.',
    ],
  },

  extrasHeading: 'Small things we’re proud of.',
  extras,

  development: {
    heading: 'Where development stands.',
    note: 'Development targets are the platforms the game is being built for. They are not a list of supported headsets, and they don’t promise a release on a particular store. Everything on this page shows the game in development, and details can change.',
  },

  availability: {
    heading: 'Where to get it.',
    none: 'Sheriff Town VR isn’t on sale yet, and no store listing has been announced. When one exists, the link will be here.',
  },
  /** Real store pages only. See StoreEntry in types.ts. */
  stores: [] as StoreEntry[],
  /** A real page where players can follow the game, such as a community or newsletter. */
  updates: { label: 'Follow the game on Discord', url: channels.discord } as ExternalLink | null,
  /** The real trailer. The player is fetched from YouTube only when a visitor presses play. */
  trailer: {
    youtubeId: 'wvhj1mbbsrk',
    url: 'https://www.youtube.com/watch?v=wvhj1mbbsrk',
    title: 'Sheriff Town VR – Official Trailer',
    label: 'Watch the trailer',
    eyebrow: 'Official trailer',
    heading: 'See the town in motion.',
    lede: 'Watch the official Sheriff Town VR trailer.',
    note: 'The trailer plays from YouTube, and loads only when you press play.',
    /* Key art: the arrest, which is what the game is about. */
    poster: images.posterArrest,
  } as Trailer | null,

  /** Real places to follow the game. Leave the list empty and the section is left out. */
  community: {
    heading: 'Join the posse.',
    lede: 'Sheriff Town VR is still being made. Follow it as it comes together, and tell us what you think.',
    channels: [
      {
        name: 'Discord',
        icon: 'chat',
        title: 'The Sheriff Town VR server',
        text: 'The official home of the game. Come and talk about it with us.',
        action: 'Join the Discord',
        url: channels.discord,
      },
      {
        name: 'YouTube',
        icon: 'play',
        title: '@SheriffTownVR',
        text: 'The game’s own channel, where the official trailer is.',
        action: 'Visit the channel',
        url: channels.youtube,
      },
    ] as Channel[],
  },

  galleryHeading: 'From the game.',
  galleryLede: 'In-game captures and in-engine renders, all from Unity. Select a picture to see it larger.',
  gallery: [
    images.stvArrival,
    images.stvLineup,
    images.stvFunCourt,
    images.stvBottleTrap,
    images.stvExperiments,
    images.stvDistrict,
    images.stvShop,
    images.stvArmory,
    images.stvToolGuns,
    images.stvPhysicsTools,
    images.stvFort,
  ] as SiteImage[],

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
