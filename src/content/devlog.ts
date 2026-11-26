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
    slug: 'fourteen-tool-guns',
    title: 'Fourteen tool guns: how the physics sandbox in Sheriff Town VR works',
    description:
      'A tour of the 14 tool guns in Sheriff Town VR, our VR physics sandbox for Meta Quest and PC VR: Gravity, Portal, Ice, Bubble, Food, Copy-Paste and more, and the rules we gave them.',
    date: '2026-11-26',
    image: images.stvToolGuns,
    intro:
      'Sheriff Town VR is a police game, but it is also a physics sandbox. Between cases, and sometimes in the middle of them, you carry a toolbox of fourteen tool guns that bend the rules of the town. This post walks through what they do, and the few rules we gave them so that fourteen guns still feel like one toolbox.',
    sections: [
      {
        heading: 'One toolbox, one way to hold it',
        paragraphs: [
          'Every tool gun works the same way in your hand. A straight beam shows exactly what the gun is pointed at and stops on the first thing it hits, so you never wonder what you are about to change. A small screen on the gun says what mode it is in, the trigger does the main job, and a second button does the second one. Learn one tool gun and you can pick up the next.',
          'We were also strict about what a gun takes from you. A tool gun only uses the buttons it needs, so you can still walk, turn and jump with one in your hand.',
        ],
      },
      {
        heading: 'Make things, then move them',
        paragraphs: [
          'The Spawn Gun is where most sessions start: it puts props, people, weapons and vehicles wherever you point it. The Physics Gun picks things up at a distance and holds them where you want them. The Size Gun makes things bigger or smaller, and the Joint Gun fastens things together.',
          'The Gravity Gun pulls whatever the beam is on towards you and holds it floating in front of the muzzle, whatever it weighs. Let go of the trigger and it punts what you are holding along your aim. Click the stick and it sends out a shockwave that throws everything nearby outward and up.',
        ],
      },
      {
        heading: 'Read anything, copy anything',
        paragraphs: [
          'The Scanner Gun changes nothing. Point it at a thing and a card floats above it with what is true about it: what it is, how heavy and fast it is, whether it is frozen or fastened to something, and for a person, their mood. You can pin a card so it stays and keeps reading, and you can even scan yourself.',
          'The Copy-Paste Gun takes the thing you point at and everything attached to it, and stamps copies of it wherever you like, as many as you want. If you paste one too many, hold the second button and it takes the last one back. The Save Gun keeps a build for good, as a file with a picture, so the contraption you made today is still there tomorrow.',
        ],
      },
      {
        heading: 'Doors, bubbles and statues',
        paragraphs: [
          'The Portal Gun places two doors, one amber and one cyan, on any flat surface. Walk through one and you come out of the other, and so does anything you throw. It will not place a door across an edge, because a door half on a wall sends things into the wall.',
          'The Bubble Gun blows soap bubbles. Whatever a bubble touches, a person, an animal or a crate, it swells round and floats up, bobbing, until it pops. It never closes around you: a bubble around your own head is not a good feeling in VR, so you can pop them but never ride one.',
          'The Ice Gun is a frost beam. Hold it on someone and the ice creeps up from their feet and slows them, until they are a statue in a cracked shell for a while. And a statue can be cuffed, which makes the Ice Gun a very effective, very non-lethal arrest.',
        ],
      },
      {
        heading: 'Lunch, a sting, or bait',
        paragraphs: [
          'The Food Gun fires the town’s food. Lob it gently past someone’s mouth and they catch it and eat it, or spit it out if they hate it. Fire it hard and it stings. Leave it on the floor and the town’s dogs and people will come for it, which is useful when you want someone to be somewhere else. It is a food fight, not a weapon: it can knock someone down, but it never wounds them.',
        ],
      },
      {
        heading: 'Wire it up, then change it',
        paragraphs: [
          'The Connection Gun links a remote, a trigger or a switch to whatever it should drive: a remote to a car, a pressure plate to a cannon, a lever to a thruster. The physics tools, thrusters, propellers, balloons, motors and pistons, all run from those links, so a few pulls of the trigger turn a pile of parts into a machine.',
          'The Modification Gun opens a panel on your other hand and lets you change the thing you point at: a weapon’s fire mode, a person’s orders, a colour or a size.',
        ],
      },
      {
        heading: 'What we left out on purpose',
        paragraphs: [
          'Some ideas did not make the cut, for good reasons. Portals do not show the view through them, because rendering extra views for every eye is too much to ask of a standalone headset. Only things you spawned can be copied, not the walls of the level. And there is no limit on how many parts a build can have: you decide how much is too much.',
          'Sheriff Town VR is still in development, so the guns will keep changing as we test them. The idea will not: fourteen strange tools, one way to hold them, and a town to try them on.',
        ],
      },
    ],
  },
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
