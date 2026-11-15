import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'
import { useLocation } from 'react-router'
import type { RackItem } from '../content/game.ts'
import { Arrow } from './Arrow.tsx'
import { Picture } from './Picture.tsx'

/*
 * Everything that moves on the site lives here. Each effect checks
 * prefers-reduced-motion first; with it requested, nothing animates and every
 * piece of content is simply there.
 */

const motionAllowed = () =>
  typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

/* ---------- Site-wide: sections rise in as they arrive, cards tilt under the mouse ---------- */

/* What rises into view as the page scrolls. */
const REVEAL = [
  '.section-head',
  '.split > *',
  '.pillars > li',
  '.cases > li',
  '.shots > li',
  '.steps > li',
  '.people-brief > li',
  '.profiles > *',
  '.faq-layout > *',
  '.duo > *',
  '.trio > *',
  '.quad > *',
  '.dispatch',
  '.overheard > *',
  '.stats__item',
  '.rack__stage',
  '.cta__item',
].join(', ')

/**
 * Mounted once in App. On each page it marks what is below the fold so it can
 * rise in when it arrives, and gives cards marked [data-tilt] a 3D tilt and a
 * glint that follow the mouse.
 */
export function MotionEffects() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (!motionAllowed()) return
    const fold = window.innerHeight * 0.92
    const waiting = [...document.querySelectorAll<HTMLElement>(REVEAL)].filter(
      (element) => element.getBoundingClientRect().top > fold && !element.hasAttribute('data-shown'),
    )
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-shown', '')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -4% 0px' },
    )
    for (const element of waiting) {
      const siblings = element.parentElement ? [...element.parentElement.children] : []
      element.style.setProperty('--i', String(Math.min(siblings.indexOf(element), 6)))
      element.setAttribute('data-reveal', '')
      observer.observe(element)
    }
    return () => observer.disconnect()
  }, [pathname])

  useEffect(() => {
    if (!motionAllowed() || !finePointer()) return
    let current: HTMLElement | null = null
    const reset = (element: HTMLElement) => {
      element.style.removeProperty('--tx')
      element.style.removeProperty('--ty')
      element.removeAttribute('data-tilting')
    }
    const onMove = (event: globalThis.PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-tilt]') : null
      if (current && current !== target) reset(current)
      current = target
      if (!target) return
      const box = target.getBoundingClientRect()
      target.style.setProperty('--tx', ((event.clientX - box.left) / box.width - 0.5).toFixed(3))
      target.style.setProperty('--ty', ((event.clientY - box.top) / box.height - 0.5).toFixed(3))
      target.setAttribute('data-tilting', '')
    }
    const onLeave = () => current && reset(current)
    document.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      document.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return null
}

/* ---------- The opening: floating light motes over the picture ---------- */

/** Specks of warm light drifting up through the picture. Decorative; drawn only while on screen. */
export function Motes() {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const element = canvas.current
    const context = element?.getContext('2d')
    if (!element || !context || !motionAllowed()) return

    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    const resize = () => {
      width = element.clientWidth
      height = element.clientHeight
      element.width = Math.round(width * ratio)
      element.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    resize()
    const resizer = new ResizeObserver(resize)
    resizer.observe(element)

    const motes = Array.from({ length: 46 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 2.2,
      speed: 0.012 + Math.random() * 0.03,
      sway: Math.random() * Math.PI * 2,
      warm: Math.random() > 0.35,
    }))

    let frame = 0
    let last = performance.now()
    let visible = true
    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      context.clearRect(0, 0, width, height)
      for (const mote of motes) {
        mote.y -= mote.speed * dt
        mote.sway += dt * 0.8
        if (mote.y < -0.05) {
          mote.y = 1.05
          mote.x = Math.random()
        }
        const x = (mote.x + Math.sin(mote.sway) * 0.012) * width
        const y = mote.y * height
        const fade = Math.min(1, mote.y * 3, (1 - mote.y) * 4)
        const glow = context.createRadialGradient(x, y, 0, x, y, mote.r * 4)
        const colour = mote.warm ? '255, 196, 120' : '255, 255, 255'
        glow.addColorStop(0, `rgba(${colour}, ${0.85 * fade})`)
        glow.addColorStop(1, `rgba(${colour}, 0)`)
        context.fillStyle = glow
        context.beginPath()
        context.arc(x, y, mote.r * 4, 0, Math.PI * 2)
        context.fill()
      }
      if (visible) frame = requestAnimationFrame(draw)
    }
    const watcher = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) {
        last = performance.now()
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(draw)
      }
    })
    watcher.observe(element)

    return () => {
      visible = false
      cancelAnimationFrame(frame)
      watcher.disconnect()
      resizer.disconnect()
    }
  }, [])

  return <canvas className="motes" ref={canvas} aria-hidden="true" />
}

/** A sheriff's star that turns slowly like a coin, over the opening picture. */
export function StarBadge({ text }: { text: string }) {
  const face = (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="56" fill="url(#badge-rim)" />
      <circle cx="60" cy="60" r="47" fill="#1d2633" />
      <path
        d="M60 22 L69.4 47.1 L96.2 48.2 L75.2 64.9 L82.4 90.8 L60 76 L37.6 90.8 L44.8 64.9 L23.8 48.2 L50.6 47.1 Z"
        fill="url(#badge-gold)"
        stroke="#fff3cf"
        strokeWidth="1.2"
      />
      <defs>
        <linearGradient id="badge-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="0.5" stopColor="#f0b43c" />
          <stop offset="1" stopColor="#b9771a" />
        </linearGradient>
        <linearGradient id="badge-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd77a" />
          <stop offset="1" stopColor="#a8661a" />
        </linearGradient>
      </defs>
    </svg>
  )

  return (
    <div className="badge" aria-hidden="true">
      <div className="badge__coin">
        <div className="badge__face">{face}</div>
        <div className="badge__face badge__face--back">{face}</div>
      </div>
      <p className="badge__text">{text}</p>
    </div>
  )
}

/* ---------- A strip of words that runs across the page ---------- */

/** Decorative: every phrase here is said properly elsewhere on the page. */
export function Ticker({ words }: { words: string[] }) {
  const run = (
    <ul className="ticker__run">
      {words.map((word) => (
        <li key={word}>{word}</li>
      ))}
    </ul>
  )

  return (
    <div className="ticker on-ink" aria-hidden="true">
      <div className="ticker__track">
        {run}
        {run}
      </div>
    </div>
  )
}

/* ---------- Real numbers that count up when they arrive ---------- */

type Stat = { value: number; suffix: string; label: string }

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(() => (motionAllowed() ? 0 : value))

  useEffect(() => {
    const element = ref.current
    if (!element || !motionAllowed()) return
    let frame = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1400)
        setShown(Math.round(value * (1 - Math.pow(1 - t, 3))))
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    })
    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  return (
    <span className="stats__value" ref={ref}>
      <span aria-hidden="true">
        {shown}
        {suffix}
      </span>
      <span className="visually-hidden">
        {value}
        {suffix}
      </span>
    </span>
  )
}

export function Stats({ items, label }: { items: Stat[]; label: string }) {
  return (
    <section className="stats" aria-label={label}>
      <ul className="wrap stats__list">
        {items.map((item) => (
          <li className="stats__item" key={item.label}>
            <CountUp value={item.value} suffix={item.suffix} />
            <span className="stats__label">{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ---------- A line typed out as if spoken ---------- */

/**
 * Shows a line a few letters at a time, with a small voice meter while it
 * "speaks". Screen readers get the whole line at once.
 */
export function TypedLine({ text }: { text: string }) {
  const [count, setCount] = useState(() => (motionAllowed() ? 0 : text.length))

  /* The parent gives each line its own key, so a new line starts again from nothing. */
  useEffect(() => {
    if (!motionAllowed()) return
    const timer = window.setInterval(() => {
      setCount((now) => {
        if (now >= text.length) window.clearInterval(timer)
        return Math.min(text.length, now + 1)
      })
    }, 24)
    return () => window.clearInterval(timer)
  }, [text])

  const speaking = count < text.length

  return (
    <>
      <span className="typed" aria-hidden="true">
        {text.slice(0, count)}
        <span className="typed__rest">{text.slice(count)}</span>
      </span>
      <span className="visually-hidden">{text}</span>
      <span className="voice" data-speaking={speaking ? '' : undefined} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
    </>
  )
}

/* ---------- The 3D rack ---------- */

type RackSet = { label: string; items: RackItem[] }

/**
 * The Sheriff's kit on a turning ring. It turns by itself while nobody is
 * using it; drag it, use the buttons, or the arrow keys when it has focus.
 * The name and use of the model at the front are read out as it changes.
 */
export function ToolRack({ heading, lede, sets }: { heading: string; lede: string; sets: Record<string, RackSet> }) {
  const keys = Object.keys(sets)
  const [setKey, setSetKey] = useState(keys[0])
  const items = sets[setKey].items
  const count = items.length
  const step = 360 / count
  const [turn, setTurn] = useState(0)
  const [drag, setDrag] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  /* Once someone turns the rack themselves, it stops turning by itself. */
  const [touched, setTouched] = useState(false)
  const section = useRef<HTMLElement>(null)
  const start = useRef(0)
  const front = ((turn % count) + count) % count
  const item = items[front]

  /* Turns by itself, every few seconds, while visible and not in use. */
  useEffect(() => {
    if (!motionAllowed() || paused || touched || drag !== null) return
    const element = section.current
    let visible = false
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    if (element) observer.observe(element)
    const timer = window.setInterval(() => {
      if (visible && !document.hidden) setTurn((now) => now + 1)
    }, 3200)
    return () => {
      window.clearInterval(timer)
      observer.disconnect()
    }
  }, [paused, touched, drag, setKey])

  const go = (by: number) => {
    setTouched(true)
    setTurn((now) => now + by)
  }

  const chooseSet = (key: string) => {
    setTouched(true)
    setSetKey(key)
    setTurn(0)
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    start.current = event.clientX
    setTouched(true)
    setDrag(0)
  }
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (drag === null) return
    setDrag(event.clientX - start.current)
  }
  const onPointerUp = () => {
    if (drag === null) return
    const moved = Math.round(-drag / 90)
    setTurn((now) => now + moved)
    setDrag(null)
  }
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') go(1)
    else if (event.key === 'ArrowLeft') go(-1)
    else return
    event.preventDefault()
  }

  const rotation = -turn * step + (drag ?? 0) * 0.35
  const radiusFactor = (0.62 / Math.tan(Math.PI / count)).toFixed(3)

  return (
    <section
      className="rack-section on-ink"
      aria-labelledby="rack-title"
      ref={section}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="wrap">
        <div className="section-head rack__head">
          <h2 className="h-section" id="rack-title">
            {heading}
          </h2>
          <p className="lede">{lede}</p>
          <div className="rack__sets" role="group" aria-label="Which kit">
            {keys.map((key) => (
              <button
                key={key}
                className="dispatch__mode"
                type="button"
                aria-pressed={key === setKey}
                onClick={() => chooseSet(key)}
              >
                {sets[key].label}
              </button>
            ))}
          </div>
        </div>

        <div
          className="rack__stage"
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          aria-label={`${sets[setKey].label}. Use the arrow keys to turn.`}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          data-dragging={drag !== null ? '' : undefined}
        >
          <div className="rack__floor" aria-hidden="true" />
          <div
            className="rack__ring"
            aria-hidden="true"
            style={{ '--rotation': `${rotation}deg`, '--factor': radiusFactor } as CSSProperties}
          >
            {items.map((entry, index) => {
              const angle = index * step
              const facing = Math.cos(((angle + rotation) * Math.PI) / 180)
              return (
                <div
                  key={`${setKey}-${entry.id}`}
                  className="rack__item"
                  data-front={index === front ? '' : undefined}
                  style={
                    {
                      '--angle': `${angle}deg`,
                      '--i': index,
                      opacity: (0.18 + 0.82 * Math.max(0, (facing + 0.35) / 1.35)).toFixed(3),
                    } as CSSProperties
                  }
                >
                  <div className="rack__float">
                    <Picture image={{ ...entry.image, alt: '' }} sizes="(min-width: 56em) 240px, 40vw" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rack__caption">
          <div aria-live="polite" className="rack__now">
            <p className="rack__count">
              {front + 1} / {count}
            </p>
            <h3 className="rack__name">{item.name}</h3>
            <p className="rack__text">{item.text}</p>
          </div>
          <div className="rack__nav">
            <button className="btn btn--light" type="button" onClick={() => go(-1)}>
              <Arrow back />
              <span>Previous</span>
            </button>
            <button className="btn btn--accent" type="button" onClick={() => go(1)}>
              <span>Next</span>
              <Arrow />
            </button>
          </div>
          <p className="rack__note">{item.image.caption}</p>
        </div>
      </div>
    </section>
  )
}
