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
    question: 'What does Praamix make?',
    answer:
      'Two things. Our own original games, starting with Sheriff Town VR, and games developed for clients, from a single production stage to the whole pipeline.',
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
    question: 'How is full-pipeline work scoped?',
    answer:
      'It starts with discovery: your goals, audience, platforms and constraints. From that comes a scope and a delivery plan with milestones. Timing, price, rights and support are agreed for each project and written into the project agreement.',
  },
  {
    question: 'How do I start a project?',
    answer:
      'With a short brief: what the game is, where it should run and how far along it is. The brief is on the contact page.',
  },
  {
    question: 'What is the status of Sheriff Town VR?',
    answer:
      'It is in development for standalone and PC VR. No release date or store listing has been announced.',
  },
]

export const home = {
  hero: {
    eyebrow: 'Original games + client development',
    title: ['From first idea.', 'To playable world.'],
    lede: 'Original games and full-pipeline development with Unity and Unreal Engine.',
    audiences: 'For players with curiosity. For clients with a vision.',
    playerAction: 'Explore our games',
    clientAction: 'Build a game with us',
  },

  facts: ['Unity + Unreal Engine', '2D + 3D', 'Mobile · PC · Web · Console · XR'],

  pipeline: {
    title: ['One studio.', 'The whole pipeline.'],
    lede: 'We create original games and partner with clients to develop games from concept to launch. Bring us the whole production, or a single stage of it.',
    action: 'Explore our services',
    steps,
  },

  game: {
    heading: 'Our first world.',
    action: 'Discover the game',
  },

  curious: {
    heading: 'Made for the curious.',
    lede: 'Three things Sheriff Town VR is built around.',
    tabsLabel: 'What Sheriff Town VR is built around',
  },

  studio: {
    title: ['Games with room', 'to try things.'],
    body: [
      'We like games you can get your hands on. The kind where you wonder what happens if you try something, and the game lets you find out.',
      'That curiosity is behind Sheriff Town VR, and it is how we approach the games we build with clients.',
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
    client: {
      title: 'Have a game in mind?',
      text: 'See what we can take on and how a project runs.',
    },
    player: {
      title: 'Looking for your next game?',
      text: 'Meet Sheriff Town VR, our first original game.',
      action: 'Discover the game',
    },
  },
}
