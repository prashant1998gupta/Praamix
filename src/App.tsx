import { useEffect, useRef } from 'react'
import type { MouseEvent } from 'react'
import { Route, Routes, useLocation, useNavigationType } from 'react-router'
import { Footer } from './components/Footer.tsx'
import { Header } from './components/Header.tsx'
import { site } from './content/site.ts'
import { Game } from './pages/Game.tsx'
import { Home } from './pages/Home.tsx'
import { NotFound } from './pages/NotFound.tsx'

/**
 * Scroll and focus after navigation.
 *   /#section    go to the section and move focus there. It glides when the
 *                section is on the page already showing, and jumps otherwise
 *                or when reduced motion is requested.
 *   new page     start at the top with focus on the page content
 *   back/forward leave scrolling to the browser, which restores the old position
 *   first load   leave everything alone unless the address names a section
 *
 * Scrolling is animated here and nowhere else, so moving through the page
 * with the Tab key is never slowed down by it.
 */
function RouteEffects() {
  const { pathname, hash, key } = useLocation()
  const navigationType = useNavigationType()
  const firstKey = useRef<string | null>(null)
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (firstKey.current === null) firstKey.current = key
    const isFirstLoad = firstKey.current === key
    const samePage = lastPath.current === pathname
    lastPath.current = pathname

    if (hash) {
      const section = document.getElementById(hash.slice(1))
      if (section) {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const glide = samePage && !isFirstLoad && !reduced
        section.scrollIntoView({ behavior: glide ? 'smooth' : 'instant' })
        section.focus({ preventScroll: true })
        return
      }
    }

    if (isFirstLoad) return
    if (navigationType !== 'POP') window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname, hash, key, navigationType])

  return null
}

function skipToContent(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault()
  const main = document.getElementById('main')
  main?.focus({ preventScroll: true })
  main?.scrollIntoView()
}

export default function App() {
  return (
    <>
      <RouteEffects />
      <a className="skip-link" href="#main" onClick={skipToContent}>
        Skip to content
      </a>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games/:slug" element={<Game />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      {/* Margin notes for very wide screens. Decorative: the same words are in the page. */}
      <div className="rails" aria-hidden="true">
        <p className="rail rail--start">
          {site.wordmark} · {site.descriptor}
        </p>
        <p className="rail rail--end">{site.rail}</p>
      </div>
    </>
  )
}
