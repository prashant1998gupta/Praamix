/*
 * Who we are.
 *
 * The wording comes from each person's own public portfolio, as supplied by
 * the owner and reviewed on 15 November 2026.
 *
 *   - `role` describes the person's work. It is not a job title at Praamix.
 *   - Leave `title` empty until a corporate title is confirmed.
 *   - Leave `portrait` as null until a genuine, approved photo is supplied.
 *     Never use a generated or stock face.
 *   - Work shown in a personal portfolio is not automatically Praamix work.
 */
import type { ExternalLink, SiteImage } from './types.ts'

export type Person = {
  id: string
  name: string
  /** Professional descriptor, e.g. 'Unity Game Developer'. */
  role: string
  /** Confirmed title at Praamix. Empty leaves it off the page. */
  title: string
  /** One line for the homepage. */
  intro: string
  /** Fuller profile for the studio page. */
  bio: string
  areas: string[]
  portrait: SiteImage | null
  links: ExternalLink[]
}

export const whoWeAre = {
  id: 'who-we-are',
  heading: 'Meet the people behind Praamix.',
  areasLabel: 'Main areas of work',
}

export const people: Person[] = [
  {
    id: 'prashant-gupta',
    name: 'Prashant Gupta',
    role: 'Unity Game Developer',
    title: '',
    intro: 'Gameplay systems, multiplayer, and performance across mobile, PC, web, and VR.',
    bio: 'Prashant builds games with Unity and C#, focusing on gameplay systems, multiplayer, performance, and modular architecture. His portfolio spans mobile, PC, WebGL, and VR projects.',
    areas: ['Unity and C#', 'Gameplay systems', 'Multiplayer', 'Performance optimization'],
    portrait: null,
    links: [{ label: 'View portfolio', url: '/prashant/' }],
  },
  {
    id: 'aman-yadav',
    name: 'Aman Yadav',
    role: 'Unity 3D & VR Developer',
    title: '',
    intro: 'Unity, VR interaction, and AR experiences across mobile devices and headsets.',
    bio: 'Aman develops games and immersive experiences with Unity and C#, with a focus on gameplay, VR interaction, and AR. His portfolio covers mobile and headset experiences, including work with AR Foundation.',
    areas: ['Unity and C#', 'VR interaction', 'AR Foundation', 'Mobile gameplay'],
    portrait: null,
    links: [{ label: 'View portfolio', url: '/aman/' }],
  },
]
