/* Homepage copy. */
import type { Faq, IconName } from './types.ts'

type Step = { icon: IconName; title: string; text: string }

const steps: Step[] = [
  { icon: 'bulb', title: 'Concept', text: 'Shape the idea, the scope and the plan.' },
  { icon: 'pencil', title: 'Art', text: 'Build the look, the characters and the world.' },
  { icon: 'code', title: 'Development', text: 'Bring it to life in Unity or Unreal Engine.' },
  { icon: 'rocket', title: 'Launch', text: 'Optimise, test and prepare the release.' },
]

const faq: Faq[] = [
  {
    question: 'What is Sheriff Town VR?',
    answer:
      'Our first original game: a VR sandbox where you are the sheriff of a town that talks back, built around arrests rather than kills. It comes out on Meta Quest on 1 December 2026, at $12.99. A PC VR version is also in development, and multiplayer is planned.',
  },
  {
    question: 'What does Praamix make?',
    answer:
      'Our own original games first, starting with Sheriff Town VR. We also develop games for clients, from a single production stage to the whole pipeline.',
  },
  {
    question: 'Do you work in Unity or Unreal Engine?',
    answer:
      'Both. Unity with C#, and Unreal Engine with Blueprints and C++. Which one fits depends on the game: its requirements, target platforms, visual goals, any existing code and the performance budget.',
  },
  {
    question: 'Which platforms do you build for?',
    answer:
      'We build across mobile, PC, web, console and XR. The actual devices and the test coverage are defined for each project.',
  },
  {
    question: 'How do I start a project?',
    answer:
      'With a short brief: what the game is, where it should run and how far along it is. The brief is on the contact page.',
  },
]

export const home = {
  hero: {
    eyebrow: 'A Praamix original',
    playerAction: 'Discover the game',
    mapsAction: 'Pick a map',
  },

  studioLine: {
    text: 'Praamix is an independent game studio. We make our own games first, and build games for clients with Unity and Unreal Engine.',
    action: 'Game development services',
  },

  pillars: {
    heading: 'What you do in Sheriff Town.',
    action: 'Everything in the game',
  },

  pipeline: {
    title: ['We build games', 'for others, too.'],
    lede: 'The skills behind Sheriff Town VR are available for your game. Bring us the whole production, from concept to launch, or a single stage of it.',
    action: 'Explore our services',
    steps,
  },

  studio: {
    title: ['Games you can', 'get your hands on.'],
    body: [
      'We make the kind of games we want to play: you reach out, grab something, and the world answers back. Sheriff Town VR is the first.',
      'The same habits go into client work. Prototype early, play it often, and keep what feels good in the hand.',
    ],
    action: 'About the studio',
  },

  people: {
    action: 'Meet us',
  },

  faq: {
    heading: 'Common questions.',
    items: faq,
  },

  closing: {
    player: {
      title: 'Ready for your first shift?',
      text: 'Everything about Sheriff Town VR, in one place.',
      action: 'Discover the game',
    },
    client: {
      title: 'Have a game in mind?',
      text: 'See what we can take on and how a project runs.',
    },
  },
}
