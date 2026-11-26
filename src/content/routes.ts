/*
 * Every page of the site, with the title and description shown in browser
 * tabs, search results and link previews. The build writes a real HTML file
 * for each one, so opening or refreshing any address works.
 */
import { devlog, devlogPath, posts } from './devlog.ts'
import { gamePath, sheriffTownVr } from './game.ts'
import { SIZES, images } from './images.ts'
import { inquiryMode, legalIsDraft, site } from './site.ts'
import type { ImageFile } from './types.ts'

export type RouteMeta = {
  path: string
  title: string
  description: string
  /** Keeps unfinished pages out of search results. */
  noindex?: boolean
  /** True for a page that uses the dark theme, which is all of them. Keep in step with isNight below. */
  night?: boolean
  /** The main picture at the top of the page. The browser fetches it early. */
  preload?: { file: ImageFile; sizes: string }
  /** The file that holds the page's code, so the build can have the browser fetch it early. */
  source?: string
}

const titled = (page: string) => `${page} · ${site.name}`

export const routes: RouteMeta[] = [
  {
    path: '/',
    source: 'src/pages/Home.tsx',
    /* Titles and descriptions are what search results show. They name what people search for. */
    title: `${site.name} · VR and mobile game studio, makers of ${sheriffTownVr.title}`,
    description: site.description,
    night: true,
    preload: { file: images.stvArrival.file, sizes: SIZES.marquee },
  },
  {
    path: gamePath(sheriffTownVr),
    source: 'src/pages/Game.tsx',
    title: `${sheriffTownVr.title} · VR sandbox game for Meta Quest and PC VR · ${site.name}`,
    description:
      'Out 1 December 2026 on Meta Quest, $12.99. Sheriff Town VR is a VR physics sandbox: be the sheriff of a town that talks back, with 7 maps, 14 tool guns, 300+ voiced lines, and arrests, not kills.',
    night: true,
    preload: { file: images.stvArrival.file, sizes: SIZES.stage },
  },
  {
    path: '/services',
    source: 'src/pages/Services.tsx',
    title: titled('VR, mobile and PC game development services with Unity and Unreal'),
    description:
      'Hire Praamix for VR, mobile and PC game development with Unity and Unreal Engine: design, art, engineering, optimisation and release support, from concept to launch.',
    night: true,
  },
  {
    path: '/studio',
    source: 'src/pages/Studio.tsx',
    title: titled('Studio: independent VR and mobile game developers'),
    description: 'Praamix is an independent game studio in India. What we make, how we work with clients, and the people behind Sheriff Town VR.',
    night: true,
    preload: { file: images.stvArrival.file, sizes: SIZES.half },
  },
  {
    path: '/contact',
    source: 'src/pages/Contact.tsx',
    title: titled('Start a game development project'),
    description: 'Send Praamix a short brief about the VR, mobile or PC game you want to build. We reply with questions, then a scope and a proposal.',
    noindex: inquiryMode() === 'draft',
    night: true,
  },
  {
    path: '/terms-and-conditions',
    source: 'src/pages/Legal.tsx',
    title: titled('Terms & Conditions'),
    description: 'The terms that apply to using the Praamix website.',
    noindex: legalIsDraft(),
    night: true,
  },
  {
    path: '/privacy-policy',
    source: 'src/pages/Legal.tsx',
    title: titled('Privacy Policy'),
    description: 'What the Praamix website does with information about its visitors.',
    noindex: legalIsDraft(),
    night: true,
  },
]

/** The game's own privacy policy. This exact address is given on the game's Meta Horizon Store page: do not move it. */
export const GAME_PRIVACY_PATH = `${gamePath(sheriffTownVr)}/privacy-policy`

/* Help for the game's players. This exact address is the support link on the game's Meta Horizon Store page: do not move it. */
routes.push({
  path: '/support',
  source: 'src/pages/Support.tsx',
  title: `${sheriffTownVr.title} player support · ${site.name}`,
  description: `Help with ${sheriffTownVr.title}: contact the studio, report a bug, and answers about comfort settings, refunds and saved progress.`,
  night: true,
})

routes.push({
  path: GAME_PRIVACY_PATH,
  source: 'src/pages/Legal.tsx',
  title: `${sheriffTownVr.title} Privacy Policy · ${site.name}`,
  description: `What ${sheriffTownVr.title} does with information about its players: it collects no personal information; its only online request is Meta's own purchase check.`,
  night: true,
})

/** The game's press kit: facts, description and downloadable art for journalists and video makers. */
export const PRESS_KIT_PATH = `${gamePath(sheriffTownVr)}/press-kit`

routes.push({
  path: PRESS_KIT_PATH,
  source: 'src/pages/PressKit.tsx',
  title: `${sheriffTownVr.title} press kit · Logo, key art and fact sheet · ${site.name}`,
  description: `Press kit for ${sheriffTownVr.title}, a VR physics sandbox game for Meta Quest and PC VR: fact sheet, description, logo and key art to download, and a press contact.`,
  night: true,
})

/* The devlog: a list, then one page per post. */
routes.push({
  path: devlogPath(),
  source: 'src/pages/Devlog.tsx',
  title: `${sheriffTownVr.title} devlog · How our VR sandbox game is made · ${site.name}`,
  description: devlog.lede,
  night: true,
})

for (const post of posts) {
  routes.push({
    path: devlogPath(post),
    source: 'src/pages/Devlog.tsx',
    title: `${post.title} · ${site.name}`,
    description: post.description,
    night: true,
  })
}

export const notFound: RouteMeta = {
  path: '/404',
  title: titled('Page not found'),
  description: site.description,
  noindex: true,
  night: true,
}

/**
 * Every page is dark. The switch is kept, so one page can be made light again
 * here and with `night` in its entry above.
 */
export function isNight(_pathname: string): boolean {
  return true
}

export function metaFor(path: string): RouteMeta {
  return routes.find((route) => route.path === path) ?? notFound
}
