import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { images } from '../content/images.ts'
import { onLeanConnection } from '../hooks/loading.ts'
import { assetStages, pipeline, stages } from '../content/services.ts'
import { Arrow } from './Arrow.tsx'
import { Lines } from './Lines.tsx'
import { Picture } from './Picture.tsx'
import type { Look, Viewer } from './showroom3d.ts'

const motionAllowed = () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches
const LOOKS: Look[] = ['wire', 'clay', 'final']

/* ---------- The opening: a real asset, at three stages of production ---------- */

/**
 * One asset from our own game, drawn live: as a wireframe, as plain clay, and
 * finished. It steps through the three by itself until the visitor chooses
 * one. Where 3D is not available, a picture of the finished asset stands in.
 */
function AssetStages() {
  const [look, setLook] = useState<Look>('wire')
  const [state, setState] = useState<'poster' | 'ready' | 'failed'>('poster')
  const [engine, setEngine] = useState<Viewer | null>(null)
  const [touched, setTouched] = useState(false)
  /* On a slow or metered connection the 3D model is fetched only when asked for. */
  const [allowed, setAllowed] = useState(() => !onLeanConnection())
  const canvas = useRef<HTMLCanvasElement>(null)
  const stage = assetStages.looks[look]

  useEffect(() => {
    const surface = canvas.current
    if (!surface || !allowed) return
    let cancelled = false
    let made: Viewer | null = null
    import('./showroom3d.ts')
      .then(({ createViewer }) => {
        if (cancelled) return
        made = createViewer({ canvas: surface, base: '/models/gun-', animate: motionAllowed() })
        made.setLook('wire')
        setEngine(made)
        return made.show(assetStages.model).then(() => {
          if (!cancelled) setState('ready')
        })
      })
      .catch(() => {
        if (!cancelled) setState('failed')
      })
    return () => {
      cancelled = true
      made?.dispose()
    }
  }, [allowed])

  useEffect(() => {
    engine?.setLook(look)
  }, [engine, look])

  /* Steps through the three looks until someone picks one. */
  useEffect(() => {
    if (touched || state !== 'ready' || !motionAllowed()) return
    const timer = window.setInterval(() => {
      setLook((now) => LOOKS[(LOOKS.indexOf(now) + 1) % LOOKS.length])
    }, 3400)
    return () => window.clearInterval(timer)
  }, [touched, state])

  const choose = (next: Look) => {
    setTouched(true)
    setLook(next)
  }
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') engine?.nudge(0.4)
    else if (event.key === 'ArrowLeft') engine?.nudge(-0.4)
    else return
    event.preventDefault()
  }

  return (
    <figure className="asset">
      <div className="asset__stage showroom__stage" data-state={state} data-look={look}>
        <div className="showroom__floor" aria-hidden="true" />
        <div className="showroom__poster" aria-hidden="true">
          <Picture image={{ ...images.gunPortal, alt: '' }} sizes="(min-width: 56em) 480px, 80vw" priority />
        </div>
        <canvas
          ref={canvas}
          className="showroom__canvas"
          role="img"
          aria-label={`${assetStages.name}, shown as ${stage.label.toLowerCase()}. Drag to turn it, or use the left and right arrow keys.`}
          tabIndex={0}
          onKeyDown={onKeyDown}
        />
        {!allowed && (
          <button className="btn btn--light showroom__ask" type="button" onClick={() => setAllowed(true)}>
            Load the 3D model
            <span className="showroom__size">about 1 MB</span>
          </button>
        )}
      </div>
      {allowed && state !== 'failed' && (
        <div className="asset__looks" role="group" aria-label="Stage of production">
          {LOOKS.map((item, index) => (
            <button
              key={item}
              className="asset__look"
              type="button"
              aria-pressed={item === look}
              onClick={() => choose(item)}
            >
              <span className="asset__step" aria-hidden="true">
                {index + 1}
              </span>
              {assetStages.looks[item].label}
            </button>
          ))}
        </div>
      )}
      <figcaption className="asset__caption">
        {allowed && state !== 'failed' && (
          <span className="asset__text" aria-live="polite">
            {stage.text}
          </span>
        )}
        <span className="asset__note">{assetStages.caption}</span>
      </figcaption>
    </figure>
  )
}

type HeroProps = { id: string; eyebrow: string; title: string[]; children: ReactNode }

/** The top of the services page: the offer on one side, a live asset on the other. */
export function ServicesHero({ id, eyebrow, title, children }: HeroProps) {
  return (
    <section className="svc-hero" aria-labelledby={id}>
      <div className="wrap svc-hero__grid">
        <div className="svc-hero__text">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="svc-hero__title" id={id}>
            <Lines lines={title} />
          </h1>
          {children}
        </div>
        <AssetStages />
      </div>
    </section>
  )
}

/* ---------- The nine stages, on a track ---------- */

/**
 * The production stages along a line. Choosing one fills the line up to it
 * and shows the work and what it produces. It follows the standard tabs
 * pattern: Tab reaches the chosen stage, and the arrow keys, Home and End move
 * along the line. Narrow screens get the same stages as a list that opens.
 */
export function PipelineTrack() {
  const [active, setActive] = useState(0)
  const base = useId()
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const last = stages.length - 1
  const stage = stages[active]

  const go = (next: number, focus = false) => {
    const index = Math.max(0, Math.min(last, next))
    setActive(index)
    if (focus) tabs.current[index]?.focus()
  }
  const onKeyDown = (event: KeyboardEvent) => {
    const moves: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    }
    const next = moves[event.key]
    if (next === undefined) return
    event.preventDefault()
    go(next, true)
  }

  return (
    <div className="track">
      <div className="track__rail" role="tablist" aria-label="Production stages">
        <div className="track__line" aria-hidden="true">
          <span style={{ width: `${(active / last) * 100}%` }} />
        </div>
        {stages.map((item, index) => (
          <button
            key={item.title}
            ref={(element) => {
              tabs.current[index] = element
            }}
            className="track__stop"
            type="button"
            role="tab"
            id={`${base}-tab-${index}`}
            aria-selected={index === active}
            aria-controls={`${base}-panel`}
            tabIndex={index === active ? 0 : -1}
            data-done={index < active ? '' : undefined}
            onClick={() => go(index)}
            onKeyDown={onKeyDown}
          >
            <span className="track__dot" aria-hidden="true">
              {index + 1}
            </span>
            <span className="track__name">{item.title}</span>
          </button>
        ))}
      </div>

      <div
        className="track__panel"
        role="tabpanel"
        id={`${base}-panel`}
        aria-labelledby={`${base}-tab-${active}`}
        tabIndex={0}
      >
        <p className="track__number" aria-hidden="true">
          {String(active + 1).padStart(2, '0')}
        </p>
        <div className="track__body" key={active}>
          <h3 className="track__title">{stage.title}</h3>
          <p className="track__summary">{stage.summary}</p>
          <p>{stage.work}</p>
        </div>
        <div className="track__side" key={`side-${active}`}>
          <p className="label">{pipeline.deliverablesLabel}</p>
          <ul className="track__chips">
            {stage.deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="track__nav">
          <button className="btn btn--outline" type="button" onClick={() => go(active - 1)} disabled={active === 0}>
            <Arrow back />
            <span>Previous stage</span>
          </button>
          <button className="btn btn--solid" type="button" onClick={() => go(active + 1)} disabled={active === last}>
            <span>Next stage</span>
            <Arrow />
          </button>
        </div>
      </div>
    </div>
  )
}
