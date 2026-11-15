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
  /** The main picture at the top of the page. The browser fetches it early. */
  preload?: { file: ImageFile; sizes: string }
}

const titled = (page: string) => `${page} · ${site.name}`

export const routes: RouteMeta[] = [
  {
    path: '/',
    title: `${site.name} · ${site.descriptor}`,
    description: site.description,
    preload: { file: images.worldBuilding.file, sizes: SIZES.hero },
  },
  {
    path: gamePath(sheriffTownVr),
    title: titled(sheriffTownVr.title),
    description: sheriffTownVr.summary,
    preload: { file: images.townInHands.file, sizes: SIZES.hero },
  },
  {
    path: '/services',
    title: titled('Game development services'),
    description:
      'Full-pipeline game development with Unity and Unreal Engine: design, art, engineering, optimisation and release support, across mobile, PC, web, console and XR.',
    preload: { file: images.worldBuilding.file, sizes: SIZES.hero },
  },
  {
    path: '/studio',
    title: titled('Studio'),
    description: 'What Praamix makes, how it works with clients, and the people behind it.',
    preload: { file: images.townTree.file, sizes: SIZES.hero },
  },
  {
    path: '/contact',
    title: titled('Start a project'),
    description: 'Send Praamix a short brief about the game you want to build.',
    noindex: inquiryMode() === 'draft',
  },
  {
    path: '/terms-and-conditions',
    title: titled('Terms & Conditions'),
    description: 'The terms that apply to using the Praamix website.',
    noindex: legalIsDraft(),
  },
  {
    path: '/privacy-policy',
    title: titled('Privacy Policy'),
    description: 'What the Praamix website does with information about its visitors.',
    noindex: legalIsDraft(),
  },
]

export const notFound: RouteMeta = {
  path: '/404',
  title: titled('Page not found'),
  description: site.description,
  noindex: true,
}

export function metaFor(path: string): RouteMeta {
  return routes.find((route) => route.path === path) ?? notFound
}
