/* Services page: engines, game types, platforms and the ways to work together. */
import type { IconName } from './types.ts'

type Platform = { icon: IconName; name: string; detail: string }

export const engines = {
  heading: 'The right engine for your game.',
  lede: 'We work in both engines, so the choice follows the game: its requirements, target platforms, visual goals, any existing codebase, the performance budget and what your team needs.',
  items: [
    {
      name: 'Unity',
      path: 'C# gameplay and systems.',
      detail: 'Engineering in C#, for new projects and for existing Unity codebases.',
    },
    {
      name: 'Unreal Engine',
      path: 'Blueprints and C++ development.',
      detail: 'Engineering in Blueprints and C++, for new projects and for existing Unreal Engine codebases.',
    },
  ],
}

export const gameTypes = {
  heading: 'Whatever kind of game it is.',
  lede: 'These are the kinds of games we take on for clients. They are not a list of games we have released.',
  formats: ['2D and 3D', 'Single-player and multiplayer'],
  groups: [
    { title: 'Quick to pick up', items: ['Casual', 'Hypercasual', 'Puzzle', 'Arcade'] },
    { title: 'Action and story', items: ['Action and adventure', 'Shooters', 'RPGs'] },
    { title: 'Skill and competition', items: ['Racing', 'Sports', 'Strategy'] },
    { title: 'Simulation and learning', items: ['Simulation', 'Educational', 'Serious games'] },
  ],
}

const platformList: Platform[] = [
  { icon: 'phone', name: 'Mobile', detail: 'Android and iOS phones and tablets.' },
  {
    icon: 'monitor',
    name: 'PC',
    detail: 'Windows, macOS and Linux, according to the chosen engine and the project scope.',
  },
  {
    icon: 'globe',
    name: 'Web',
    detail: 'Browser-playable games on agreed desktop and mobile browsers, through a delivery approach chosen to suit the game.',
  },
  {
    icon: 'gamepad',
    name: 'Consoles',
    detail: 'PlayStation, Xbox and Nintendo platforms, subject to the relevant developer access, SDKs, supported engine versions and platform requirements.',
  },
  {
    icon: 'headset',
    name: 'VR',
    detail: 'Standalone and PC-connected headsets, with headset and input compatibility defined per project.',
  },
  {
    icon: 'layers',
    name: 'AR and mixed reality',
    detail: 'Supported phones, tablets and headsets, with hardware, interaction and runtime requirements agreed per project.',
  },
]

export const platforms = {
  heading: 'Built for the way people play.',
  lede: 'We build across mobile, PC, web, console and XR.',
  items: platformList,
  note: 'Target devices and test coverage are defined per project. A single build is not guaranteed to run on every device.',
}

export const ways = {
  heading: 'The whole game, or the part you need.',
  items: [
    { title: 'Full production', text: 'From the first idea through to release, as one project.' },
    { title: 'A single stage', text: 'One part of the pipeline, such as art production, engineering or optimisation.' },
    { title: 'An existing project', text: 'Joining a game that is already in development.' },
  ],
}

export const ownWork = {
  label: 'Praamix original project',
  heading: 'We are building our own game too.',
  body: 'Sheriff Town VR is a Praamix original, in development for standalone and PC VR. It is our own game, not commissioned client work.',
  action: 'See Sheriff Town VR',
}
