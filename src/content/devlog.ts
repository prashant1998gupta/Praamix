/*
 * The devlog: articles about how Sheriff Town VR is being made.
 *
 * Written from the game's own design documents (Docs/SheriffTown in the game
 * project). Describe only what is built, say plainly that the game is in
 * development, and never add numbers, dates or features that are not real.
 * Newest post first.
 */
import { images } from './images.ts'
import type { SiteImage } from './types.ts'

export type DevlogSection = { heading: string; paragraphs: string[] }

export type DevlogPost = {
  slug: string
  title: string
  /** One or two sentences. Shown in search results and on the devlog list. */
  description: string
  /** The day it was published, as YYYY-MM-DD. */
  date: string
  image: SiteImage
  intro: string
  sections: DevlogSection[]
}

export const devlog = {
  eyebrow: 'Devlog',
  heading: 'Making Sheriff Town VR.',
  lede: 'Notes from the studio on how our VR sandbox game for Meta Quest and PC VR is being built: the systems, the people of the town, and the decisions behind them.',
}

export const posts: DevlogPost[] = [
  {
    slug: 'bring-them-in-alive',
    title: 'Bring them in alive: designing arrests, not kills, in a VR sandbox',
    description:
      'Why Sheriff Town VR is built around the arrest rather than the kill, and how townspeople react, surrender and get cuffed in our VR police sandbox for Meta Quest and PC VR.',
    date: '2026-11-26',
    image: images.stvLineup,
    intro:
      'Most games that hand you a badge also hand you a body count. Sheriff Town VR goes the other way. The motto on the first sheriff’s statue is the design brief for the whole game: he brought them in alive. This post is about what that means once you are standing in the street with a pair of handcuffs in your hand.',
    sections: [
      {
        heading: 'A failure, not a shortcut',
        paragraphs: [
          'There are firearms in Sheriff Town’s armory. We did not want a police game where the gun is decoration. But the game is designed so that killing is never the efficient route. Non-lethal hits drain a person’s stun before they touch their health, and a person whose stun runs out goes down without dying. From there, the job is the arrest.',
          'That one rule shapes everything else. If the best outcome is a person in cuffs, then the people of the town have to do more than fall over. They have to notice you, react to you, give up, run, or fight back, in ways you can read from across a plaza.',
        ],
      },
      {
        heading: 'A town that notices you',
        paragraphs: [
          'Every person in town reacts to danger by how serious it is. A shove nearby gets a look. A gunshot, or someone tasered or beaten down, is a bigger event, and the people around it react in kind: a startle, then a choice. Civilians mostly run, or cower where they stand if there is nowhere to go. Some step in to see what happened. Gangsters are more likely to square up than to leave.',
          'The startle matters more than we expected. In VR you are close enough to see a face change, so every reaction starts with a stunned beat that plays out fully before the person decides what to do. Cutting it short made the whole town feel twitchy. Letting it play made people feel like they were thinking.',
          'People also talk while all of this happens. When a crowd reacts, the voices are spread out so they do not all shout at once, and nobody says the same line back to back. Every line in the game is voiced, each person in their own voice, so a busy street sounds like a town, not a chorus.',
        ],
      },
      {
        heading: 'Hands up',
        paragraphs: [
          'Point a gun at a civilian and they put their hands up. Some of the tougher characters will too, if you draw on them before a fight has started; once it has, they are past that.',
          'We built surrender as a pose rather than a mode. A person with their hands up still reacts to what happens around them, so if they are hit they flinch, and what they do next depends on what hit them. When you lower your gun, their hands do not snap down. They stay up for a few seconds, uncertain, the way a real person would, before they relax.',
        ],
      },
      {
        heading: 'The cuffs are a real object',
        paragraphs: [
          'Handcuffs in Sheriff Town VR are a physical tool, not a menu option. You take a pair, and to arrest someone you touch an open ring to their wrist. Both jaws click shut, their hands go behind their back, and they stand cuffed.',
          'Hold the cuffs and you lead them: walk forward and they come with you. Pull the trigger while holding the cuffs and they spring open into your hand. A calm person will not simply let you cuff them, but someone who has surrendered will, and someone you have knocked down gets back up in cuffs.',
          'The rest of the kit follows the same idea. The taser is reloaded by hand. The baton is expandable, and you flick it open. And because this is a physics sandbox, there are stranger routes to an arrest too: freeze someone solid with the Ice Gun and cuff the statue.',
        ],
      },
      {
        heading: 'Why this is the right game for VR',
        paragraphs: [
          'Arrests are slow and close. You walk up to someone, read their face, decide whether they are going to run, and put your hands on the cuffs. That is exactly the kind of moment VR is good at, and exactly the kind most shooters skip. Building the game around it gives every encounter in town a middle, not just an end.',
          'Sheriff Town VR is still in development, so details here may change before release. The arrest is the part that will not.',
        ],
      },
    ],
  },
]

export const devlogPath = (post?: DevlogPost) => (post ? `/devlog/${post.slug}` : '/devlog')
