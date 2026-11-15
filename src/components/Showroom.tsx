import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import type { RackItem } from '../content/game.ts'
import { onLeanConnection } from '../hooks/loading.ts'
import { Arrow } from './Arrow.tsx'
import { Picture } from './Picture.tsx'
import type { Viewer } from './showroom3d.ts'

type Props = {
  heading: string
  lede: string
  guns: RackItem[]
  toolsLabel: string
  tools: RackItem[]
}

const motionAllowed = () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * One tool gun at a time, drawn live from the game's own model and textures.
 * Drag it to turn it. The picker underneath chooses another. Until the 3D
 * model is ready, and wherever 3D is not available, a picture of the same
 * model stands in. The 3D code is fetched only when this section is near.
 */
export function Showroom({ heading, lede, guns, toolsLabel, tools }: Props) {
  const [index, setIndex] = useState(0)
  const [state, setState] = useState<'poster' | 'loading' | 'ready' | 'failed'>('poster')
  const [engine, setEngine] = useState<Viewer | null>(null)
  /* On a slow or metered connection the 3D model is fetched only when asked for. */
  const [allowed, setAllowed] = useState(() => !onLeanConnection())
  const section = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const item = guns[index]
  const count = guns.length

  useEffect(() => {
    const element = section.current
    const surface = canvas.current
    if (!element || !surface || !allowed) return
    let cancelled = false
    let made: Viewer | null = null
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        setState('loading')
        import('./showroom3d.ts')
          .then(({ createViewer }) => {
            if (cancelled) return
            made = createViewer({ canvas: surface, base: '/models/gun-', animate: motionAllowed() })
            setEngine(made)
          })
          .catch(() => {
            if (!cancelled) setState('failed')
          })
      },
      { rootMargin: '500px 0px' },
    )
    observer.observe(element)
    return () => {
      cancelled = true
      observer.disconnect()
      made?.dispose()
    }
  }, [allowed])

  useEffect(() => {
    if (!engine) return
    let stale = false
    engine
      .show(item.id)
      .then(() => {
        if (!stale) setState('ready')
      })
      .catch(() => {
        if (!stale) setState('failed')
      })
    engine.preload(guns[(index + 1) % count].id)
    return () => {
      stale = true
    }
  }, [engine, item.id, index, count, guns])

  const go = (by: number) => setIndex((now) => (now + by + count) % count)
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') engine?.nudge(0.4)
    else if (event.key === 'ArrowLeft') engine?.nudge(-0.4)
    else return
    event.preventDefault()
  }

  return (
    <section className="showroom on-ink" aria-labelledby="showroom-title" ref={section}>
      <div className="wrap">
        <div className="section-head showroom__head">
          <h2 className="h-section" id="showroom-title">
            {heading}
          </h2>
          <p className="lede">{lede}</p>
        </div>

        <div className="showroom__grid">
          <div className="showroom__stage" data-state={state}>
            <div className="showroom__floor" aria-hidden="true" />
            <div className="showroom__poster" aria-hidden="true">
              <Picture key={item.id} image={{ ...item.image, alt: '' }} sizes="(min-width: 56em) 520px, 80vw" />
            </div>
            <canvas
              ref={canvas}
              className="showroom__canvas"
              role="img"
              aria-label={`3D model of the ${item.name}. Drag to turn it, or use the left and right arrow keys.`}
              tabIndex={0}
              onKeyDown={onKeyDown}
            />
            <p className="showroom__hint" aria-hidden="true">
              Drag to turn
            </p>
            {!allowed && (
              <button className="btn btn--light showroom__ask" type="button" onClick={() => setAllowed(true)}>
                Load the 3D model
                <span className="showroom__size">about 1 MB</span>
              </button>
            )}
            {state === 'loading' && (
              <p className="showroom__loading" role="status">
                Loading the 3D model…
              </p>
            )}
          </div>

          <div className="showroom__panel">
            <div className="showroom__now" aria-live="polite">
              <p className="showroom__count">
                {String(index + 1).padStart(2, '0')} / {count}
              </p>
              <h3 className="showroom__name">{item.name}</h3>
              <p className="showroom__text">{item.text}</p>
            </div>
            <div className="showroom__nav">
              <button className="btn btn--light" type="button" onClick={() => go(-1)}>
                <Arrow back />
                <span>Previous</span>
              </button>
              <button className="btn btn--accent" type="button" onClick={() => go(1)}>
                <span>Next</span>
                <Arrow />
              </button>
            </div>
            <p className="showroom__note">
              {state === 'failed'
                ? item.image.caption
                : 'Real-time 3D: the game’s own model and textures · in development'}
            </p>
          </div>
        </div>

        <ul className="showroom__picker" aria-label="Choose a tool gun">
          {guns.map((gun, gunIndex) => (
            <li key={gun.id}>
              <button
                className="showroom__pick"
                type="button"
                aria-pressed={gunIndex === index}
                aria-label={gun.name}
                onClick={() => setIndex(gunIndex)}
              >
                <Picture image={{ ...gun.image, alt: '' }} sizes="96px" />
              </button>
            </li>
          ))}
        </ul>

        <div className="showroom__tools">
          <h3 className="showroom__tools-title">{toolsLabel}</h3>
          <ul className="showroom__tool-list">
            {tools.map((tool, toolIndex) => (
              <li key={tool.id} style={{ '--i': toolIndex } as CSSProperties}>
                <span className="showroom__tool-art">
                  <Picture image={{ ...tool.image, alt: '' }} sizes="(min-width: 56em) 130px, 22vw" />
                </span>
                <span className="showroom__tool-name">{tool.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
