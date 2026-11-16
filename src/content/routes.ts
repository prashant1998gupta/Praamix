/*
 * Every page of the site, with the title and description shown in browser
 * tabs, search results and link previews. The build writes a real HTML file
 * for each one, so opening or refreshing any address works.
 */
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
    title: `${site.name} · ${site.descriptor}`,
    description: site.description,
    night: true,
    preload: { file: images.stvArrival.file, sizes: SIZES.marquee },
  },
  {
    path: gamePath(sheriffTownVr),
    source: 'src/pages/Game.tsx',
    title: titled(sheriffTownVr.title),
    description: sheriffTownVr.summary,
    night: true,
    preload: { file: images.stvArrival.file, sizes: SIZES.stage },
  },
  {
    path: '/services',
    source: 'src/pages/Services.tsx',
    title: titled('Game development services'),
    description:
      'Full-pipeline game development with Unity and Unreal Engine: design, art, engineering, optimisation and release support, across mobile, PC, web, console and XR.',
    night: true,
  },
  {
    path: '/studio',
    source: 'src/pages/Studio.tsx',
    title: titled('Studio'),
    description: 'What Praamix makes, how it works with clients, and the people behind it.',
    night: true,
    preload: { file: images.stvArrival.file, sizes: SIZES.half },
  },
  {
    path: '/contact',
    source: 'src/pages/Contact.tsx',
    title: titled('Start a project'),
    description: 'Send Praamix a short brief about the game you want to build.',
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
