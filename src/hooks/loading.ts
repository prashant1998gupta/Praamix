import { useEffect } from 'react'

/*
 * Loading helpers: each page's code is fetched when it is first needed,
 * warmed up when a visitor points at a link, and heavy extras hold back on
 * slow or metered connections.
 */

/** The page files. Fetching one twice costs nothing: the browser keeps the first answer. */
export const pages = {
  home: () => import('../pages/Home.tsx'),
  game: () => import('../pages/Game.tsx'),
  services: () => import('../pages/Services.tsx'),
  studio: () => import('../pages/Studio.tsx'),
  contact: () => import('../pages/Contact.tsx'),
  legal: () => import('../pages/Legal.tsx'),
  support: () => import('../pages/Support.tsx'),
  press: () => import('../pages/PressKit.tsx'),
}

/** Which page file an address needs. */
function pageFor(pathname: string): (() => Promise<unknown>) | undefined {
  if (pathname === '/') return pages.home
  if (pathname.endsWith('/privacy-policy')) return pages.legal
  if (pathname.startsWith('/support')) return pages.support
  if (pathname.endsWith('/press-kit')) return pages.press
  if (pathname.startsWith('/games')) return pages.game
  if (pathname.startsWith('/services')) return pages.services
  if (pathname.startsWith('/studio')) return pages.studio
  if (pathname.startsWith('/contact')) return pages.contact
  if (pathname.startsWith('/terms') || pathname.startsWith('/privacy')) return pages.legal
  return undefined
}

/**
 * Starts fetching a page's code the moment a visitor points at, touches or
 * tabs to a link to it, so it is usually ready by the time they press.
 */
export function usePrefetch() {
  useEffect(() => {
    const warm = (event: Event) => {
      const link = event.target instanceof Element ? event.target.closest('a[href^="/"]') : null
      if (!link) return
      const load = pageFor(new URL(link.getAttribute('href') ?? '/', window.location.origin).pathname)
      void load?.().catch(() => undefined)
    }
    document.addEventListener('pointerover', warm, { passive: true })
    document.addEventListener('touchstart', warm, { passive: true })
    document.addEventListener('focusin', warm)
    return () => {
      document.removeEventListener('pointerover', warm)
      document.removeEventListener('touchstart', warm)
      document.removeEventListener('focusin', warm)
    }
  }, [])
}

type Connection = { saveData?: boolean; effectiveType?: string }

/**
 * True when the visitor has asked their device to save data, or is on a very
 * slow connection. Heavy extras, like the 3D models, then wait to be asked for.
 */
export function onLeanConnection(): boolean {
  const connection = (navigator as Navigator & { connection?: Connection }).connection
  if (!connection) return false
  return connection.saveData === true || /(^|-)2g$/.test(connection.effectiveType ?? '')
}

declare global {
  interface Window {
    /** Set by index.html. Fades out the loader that shows before the site's code arrives. */
    __bootDone?: () => void
  }
}
