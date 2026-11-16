import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent, ReactNode } from 'react'
import { sheriffTownVr } from '../content/game.ts'
import { SIZES } from '../content/images.ts'
import type { SiteImage } from '../content/types.ts'
import { Arrow } from './Arrow.tsx'
import { GameLogo } from './GameLogo.tsx'
import { Picture } from './Picture.tsx'

const game = sheriffTownVr

type Slide = { id: string; kind: 'capture' | 'poster'; title: string; place: string; image: SiteImage }

/* The in-game capture first, then the key art. */
const SLIDES: Slide[] = [
  { id: 'capture', kind: 'capture', ...game.marquee.capture, image: game.heroImage },
  ...game.marquee.posters.map((poster) => ({ ...poster, kind: 'poster' as const })),
]

/* A swipe shorter than this, in pixels, is a tap. */
const SWIPE = 44
/* How long after a picture arrives the one after it starts loading. */
const WARM_UP = 2200

/*
 * How each poster lies once it has landed: a few degrees off straight and a
 * little off centre, so the pile looks dealt by hand and the ones underneath
 * show at the corners.
 */
const LIE = [
  [-4, 0, 0],
  [3, 1.2, -1],
  [-2.5, -1, 1.2],
  [4.5, 0.6, -0.6],
  [-3.5, -1.4, 0.8],
  [2, 1, -1.2],
  [-5, 0, 0.6],
  [3.5, -0.8, -0.8],
  [-2, 1.4, 1],
  [4, -0.4, -0.4],
  [-3, 0.8, 1.2],
  [2.5, -1.2, 0],
]

/** Where a poster is: on top of the pile, just under it, deep in it, or not dealt yet. */
function placeOf(depth: number, dealing: boolean) {
  if (!dealing || depth < 0) return 'waiting'
  if (depth === 0) return 'top'
  if (depth === 1) return 'under'
  if (depth === 2) return 'deeper'
  return 'buried'
}

const two = (value: number) => String(value).padStart(2, '0')

type Props = {
  /** Ties the section to its heading. */
  id: string
  eyebrow: string
  /** The page's main heading. Shown as the game's logo, and read out as these words. */
  title: string
  /** Text and actions under the heading. */
  children: ReactNode
}

/**
 * The opening of the homepage. The in-game picture of the precinct fills it,
 * with the game's logo and the way in on the left. That never changes.
 *
 * The key art is dealt onto it like posters thrown down on a desk: each one
 * flies in, lands a little crooked on top of the last, and tilts under the
 * mouse. While posters are out, the precinct behind them falls out of focus.
 * When the pile has been through, it is swept away and the precinct is clear
 * again.
 *
 * The show is a revolver. The round button is the drum from the logo:
 * pressing it turns it one chamber and deals the next poster, and the ring
 * around it fills as the current one's time runs out. The show waits while it
 * is off screen, while the pointer or keyboard is on its controls, and when
 * paused. With reduced motion requested it never moves by itself.
 */
export function Marquee({ id, eyebrow, title, children }: Props) {
  const [index, setIndex] = useState(0)
  /* Counts every change, so the drum always turns forwards. */
  const [turns, setTurns] = useState(0)
  /* Pictures are fetched as they are needed, not all at once. */
  const [loaded, setLoaded] = useState(() => new Set([0]))
  const [paused, setPaused] = useState(false)
  const [held, setHeld] = useState(false)
  const [inView, setInView] = useState(true)
  const root = useRef<HTMLElement>(null)
  const press = useRef<{ x: number; y: number } | null>(null)

  const count = SLIDES.length
  const slide = SLIDES[index]
  const running = !paused && !held && inView

  const show = (next: number) => {
    const target = (next + count) % count
    if (target === index) return
    setIndex(target)
    setTurns((value) => value + 1)
    setLoaded((seen) => new Set(seen).add(target))
  }

  /* Have the next picture ready before it is needed, but not in the way of this one. */
  useEffect(() => {
    const next = (index + 1) % count
    const timer = window.setTimeout(() => setLoaded((seen) => (seen.has(next) ? seen : new Set(seen).add(next))), WARM_UP)
    return () => window.clearTimeout(timer)
  }, [index, count])

  /* Off screen, or in a tab nobody is looking at, the show waits. */
  useEffect(() => {
    const element = root.current
    if (!element) return
    let visible = true
    const update = () => setInView(visible && !document.hidden)
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        update()
      },
      { threshold: 0.35 },
    )
    observer.observe(element)
    document.addEventListener('visibilitychange', update)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  const onPointerDown = (event: PointerEvent) => {
    press.current = { x: event.clientX, y: event.clientY }
  }

  const onPointerUp = (event: PointerEvent) => {
    const start = press.current
    press.current = null
    if (!start) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy) * 1.4) show(index + (dx < 0 ? 1 : -1))
  }

  return (
    <section
      className="marquee"
      ref={root}
      aria-labelledby={id}
      data-kind={slide.kind}
      data-running={running ? '' : undefined}
    >
      <div className="marquee__art" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        {/* The label beside the controls says what each picture is, so the pictures stay silent. */}
        <div className="marquee__backdrop">
          <Picture image={{ ...game.heroImage, alt: '' }} sizes={SIZES.marquee} priority />
        </div>
        <div className="marquee__shade" aria-hidden="true" />
        <div className="marquee__pile" aria-hidden="true">
          {game.marquee.posters.map((poster, posterIndex) => {
            /* The capture is picture 0, so this poster is picture posterIndex + 1. */
            const own = posterIndex + 1
            const place = placeOf(index - own, index > 0)
            const [angle, x, y] = LIE[posterIndex % LIE.length]
            return (
              <div
                className="marquee__card"
                key={poster.id}
                data-place={place}
                data-tilt={place === 'top' ? '' : undefined}
                style={{ '--r': `${angle}deg`, '--x': x, '--y': y } as CSSProperties}
                onClick={place === 'top' ? () => show(index + 1) : undefined}
              >
                {loaded.has(own) && <Picture image={{ ...poster.image, alt: '' }} sizes={SIZES.poster} />}
              </div>
            )
          })}
        </div>
      </div>

      <div className="wrap marquee__content">
        <div className="marquee__text">
          <h1 className="marquee__logo" id={id}>
            <span className="visually-hidden">{title}</span>
            <GameLogo reveal priority spin={turns} />
          </h1>
          <p className="eyebrow">{eyebrow}</p>
          {children}
        </div>

        <div
          className="marquee__deck"
          role="group"
          aria-roledescription="slideshow"
          aria-label={game.marquee.label}
          onPointerEnter={() => setHeld(true)}
          onPointerLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={() => setHeld(false)}
        >
          <p className="marquee__now" aria-live={running ? 'off' : 'polite'}>
            <span className="marquee__kind">{slide.kind === 'poster' ? game.marquee.posterKind : slide.place}</span>
            <span className="marquee__name" key={slide.id}>
              {slide.kind === 'poster' ? `${slide.title} · ${slide.place}` : slide.title}
            </span>
            <span className="marquee__count">
              <span className="visually-hidden">Picture </span>
              {two(index + 1)}
              <span aria-hidden="true"> / </span>
              <span className="visually-hidden"> of </span>
              {two(count)}
            </span>
          </p>
          <div className="marquee__controls">
            <button className="marquee__step" type="button" onClick={() => show(index - 1)}>
              <Arrow back />
              <span className="visually-hidden">Previous picture</span>
            </button>
            <button className="marquee__drum" type="button" onClick={() => show(index + 1)}>
              <svg className="marquee__ring" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
                <circle className="marquee__ring-track" cx="50" cy="50" r="47" />
                {/* When the ring is full the next picture comes. Starting it again for each picture is what times the show. */}
                <circle
                  className="marquee__ring-fill"
                  key={index}
                  cx="50"
                  cy="50"
                  r="47"
                  pathLength="100"
                  onAnimationEnd={() => show(index + 1)}
                />
              </svg>
              <span className="marquee__chambers" style={{ '--turns': turns } as CSSProperties}>
                <Picture image={game.drum} sizes="5rem" />
              </span>
              <span className="visually-hidden">Next picture</span>
            </button>
            <button
              className="marquee__step"
              type="button"
              aria-pressed={paused}
              onClick={() => setPaused((value) => !value)}
            >
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                {paused ? (
                  <path d="M8.5 5.6v12.8a.6.6 0 0 0 .92.5l10-6.4a.6.6 0 0 0 0-1L9.42 5.1a.6.6 0 0 0-.92.5Z" fill="currentColor" />
                ) : (
                  <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
                )}
              </svg>
              <span className="visually-hidden">Pause the slideshow</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
