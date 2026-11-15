import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { Route, Routes, useLocation, useNavigationType } from 'react-router'
import { Footer } from './components/Footer.tsx'
import { Header } from './components/Header.tsx'
import { NetworkNotice, PageBoundary, PageLoading, PageReady } from './components/Loading.tsx'
import { MotionEffects } from './components/Motion.tsx'
import { isNight } from './content/routes.ts'
import { pages, usePrefetch } from './hooks/loading.ts'
import { NotFound } from './pages/NotFound.tsx'

/*
 * Each page's code is fetched when the page is first needed, so the first
 * visit downloads only what that page uses. The router keeps the current page
 * on screen until the next one is ready.
 */
const Home = lazy(() => pages.home().then((file) => ({ default: file.Home })))
const Game = lazy(() => pages.game().then((file) => ({ default: file.Game })))
const Services = lazy(() => pages.services().then((file) => ({ default: file.Services })))
const Studio = lazy(() => pages.studio().then((file) => ({ default: file.Studio })))
const Contact = lazy(() => pages.contact().then((file) => ({ default: file.Contact })))
const Terms = lazy(() => pages.legal().then((file) => ({ default: file.Terms })))
const Privacy = lazy(() => pages.legal().then((file) => ({ default: file.Privacy })))

/** The main pages are dark. The class sits on <html> so the whole window follows. */
function Theme() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.documentElement.classList.toggle('night', isNight(pathname))
  }, [pathname])

  return null
}

/**
 * Scroll and focus after navigation. It sits beside the pages, so it runs once
 * the page it is moving to is really there.
 *   #section     go to the section and move focus there. It glides when the
 *                section is on the page already showing, and jumps otherwise
 *                or when reduced motion is requested.
 *   new page     start at the top with focus on the page content
 *   back/forward leave scrolling to the browser, which restores the old position
 *   first load   leave everything alone unless the address names a section
 */
function ScrollEffects() {
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

/**
 * A line across the top from the moment a link to another page is pressed
 * until that page appears. On a fast connection it is gone before it shows;
 * on a slow one it says the press was heard.
 */
function NavProgress() {
  /* A fresh line for every page shown, so arriving anywhere, by link or by the back button, clears it. */
  const { key } = useLocation()
  return <NavLine key={key} />
}

function NavLine() {
  const [waiting, setWaiting] = useState(false)

  useEffect(() => {
    const onClick = (event: globalThis.MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return
      const link = event.target instanceof Element ? event.target.closest('a[href^="/"]') : null
      if (!link || link.getAttribute('target') === '_blank') return
      const next = new URL(link.getAttribute('href') ?? '/', window.location.origin).pathname
      if (next !== window.location.pathname) setWaiting(true)
    }
    /* Listening on the way down, so this runs before the router moves on. */
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return <div className="nav-progress" data-active={waiting ? '' : undefined} aria-hidden="true" />
}

function skipToContent(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault()
  const main = document.getElementById('main')
  main?.focus({ preventScroll: true })
  main?.scrollIntoView()
}

export default function App() {
  usePrefetch()

  return (
    <>
      <Theme />
      <NavProgress />
      <div className="scroll-progress" aria-hidden="true" />
      <a className="skip-link" href="#main" onClick={skipToContent}>
        Skip to content
      </a>
      <Header />
      <PageBoundary>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games/:slug" element={<Game />} />
            <Route path="/services" element={<Services />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms-and-conditions" element={<Terms />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* These run only once a page is on screen. */}
          <ScrollEffects />
          <MotionEffects />
          <PageReady />
        </Suspense>
      </PageBoundary>
      <Footer />
      <NetworkNotice />
    </>
  )
}
