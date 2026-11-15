import { useId, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { Link } from 'react-router'
import { gamePath, sheriffTownVr } from '../content/game.ts'
import type { GameMap, Mode } from '../content/game.ts'
import { SIZES } from '../content/images.ts'
import { useDrift } from '../hooks/useDrift.ts'
import { Arrow } from './Arrow.tsx'
import { Art, Picture } from './Picture.tsx'

const game = sheriffTownVr

/* ---------- The opening ---------- */

type StageProps = {
  /** Ties the section to its heading. */
  id: string
  eyebrow: string
  /** The page's main heading. */
  title: string
  /** Text and actions under the heading. */
  children: ReactNode
}

/**
 * The top of the homepage and the game page: an in-game picture on a dark
 * stage, with the heading on the stage beside it. On phones the picture comes
 * first and the text sits below it.
 */
export function GameStage({ id, eyebrow, title, children }: StageProps) {
  const zone = useDrift<HTMLElement>()
  const image = game.heroImage

  return (
    <section className="showcase" aria-labelledby={id} ref={zone}>
      <div className="wrap">
        <div className="showcase__frame on-ink">
          <div className="showcase__art">
            <div className="showcase__picture" data-drift="">
              <Picture image={image} sizes={SIZES.stage} priority />
            </div>
          </div>
          <div className="showcase__text">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="showcase__title" id={id}>
              {title}
            </h1>
            {children}
          </div>
        </div>
        <p className="art__caption">{image.caption}</p>
      </div>
    </section>
  )
}

/* ---------- Homepage: four ways into the game ---------- */

/** Four picture cards, each opening the matching part of the game page. */
export function Pillars({ heading, action }: { heading: string; action: string }) {
  return (
    <section className="section" aria-labelledby="pillars-title">
      <div className="wrap">
        <div className="section-head section-head--row">
          <h2 className="h-section" id="pillars-title">
            {heading}
          </h2>
          <Link className="link-arrow" to={gamePath(game)}>
            <span>{action}</span>
            <Arrow />
          </Link>
        </div>
        <ul className="pillars">
          {game.pillars.map((pillar) => (
            <li key={pillar.id}>
              <Link className="pillar" to={`${gamePath(game)}#${pillar.id}`}>
                <Art image={pillar.image} sizes={SIZES.card} variant="cover" caption={false} />
                <h3 className="pillar__title">{pillar.title}</h3>
                <p>{pillar.text}</p>
              </Link>
            </li>
          ))}
        </ul>
        <p className="art__caption">In-game captures and in-engine renders · in development</p>
      </div>
    </section>
  )
}

/* ---------- Overheard: the town's voiced lines ---------- */

/** One voiced line at a time, with a button for the next. */
export function Overheard({ band = false }: { band?: boolean }) {
  const { heading, lede, action, lines } = game.overheard
  const [index, setIndex] = useState(0)
  const line = lines[index]

  return (
    <section className={band ? 'section band' : 'section'} aria-labelledby="overheard-title">
      <div className="wrap overheard">
        <div className="stack">
          <h2 className="h-section" id="overheard-title">
            {heading}
          </h2>
          <p className="lede">{lede}</p>
        </div>
        <div className="overheard__stage">
          <figure className="bubble" aria-live="polite">
            <blockquote className="bubble__line" key={index}>
              <p>“{line.line}”</p>
            </blockquote>
            <figcaption className="bubble__who">
              <strong>{line.who}</strong>, {line.where}
            </figcaption>
          </figure>
          <div className="overheard__controls">
            <button
              className="btn btn--outline"
              type="button"
              onClick={() => setIndex((now) => (now + 1) % lines.length)}
            >
              <span>{action}</span>
              <Arrow />
            </button>
            <span className="overheard__count">
              {index + 1} of {lines.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- The Dispatch board ---------- */

const MODES: Mode[] = ['sandbox', 'challenge']

/**
 * The game's own map board, on the web. Choose Sandbox or Challenge, then a
 * map; the picture and the text beside it change to match. The maps follow the
 * standard tabs pattern: Tab reaches the selected map, the arrow keys, Home and
 * End move between maps.
 */
export function DispatchBoard({ band = false }: { band?: boolean }) {
  const { heading, lede, modes, maps } = game.dispatch
  const [mode, setMode] = useState<Mode>('sandbox')
  const [active, setActive] = useState(0)
  const base = useId()
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const shown = maps.filter((map) => map.mode === mode)
  const map: GameMap = shown[Math.min(active, shown.length - 1)]

  const chooseMode = (next: Mode) => {
    setMode(next)
    setActive(0)
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const last = shown.length - 1
    const moves: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowDown: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      ArrowUp: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    }
    const next = moves[event.key]
    if (next === undefined) return
    event.preventDefault()
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <section className={band ? 'section band' : 'section'} id="maps" aria-labelledby="maps-title" tabIndex={-1}>
      <div className="wrap">
        <div className="section-head">
          <h2 className="h-section" id="maps-title">
            {heading}
          </h2>
          <p className="lede">{lede}</p>
        </div>

        <div className="dispatch on-ink">
          <div className="dispatch__bar">
            <p className="dispatch__brand">Dispatch</p>
            <div className="dispatch__modes" role="group" aria-label="Kind of map">
              {MODES.map((item) => (
                <button
                  key={item}
                  className="dispatch__mode"
                  type="button"
                  aria-pressed={mode === item}
                  onClick={() => chooseMode(item)}
                >
                  {modes[item].label}
                </button>
              ))}
            </div>
            <p className="dispatch__mode-text">{modes[mode].text}</p>
          </div>

          <div className="dispatch__body">
            <div className="dispatch__maps" role="tablist" aria-label={`${modes[mode].label} maps`}>
              {shown.map((item, index) => (
                <button
                  key={item.id}
                  ref={(element) => {
                    tabs.current[index] = element
                  }}
                  className="dispatch__map"
                  type="button"
                  role="tab"
                  id={`${base}-tab-${item.id}`}
                  aria-selected={item.id === map.id}
                  aria-controls={`${base}-panel`}
                  tabIndex={item.id === map.id ? 0 : -1}
                  onClick={() => setActive(index)}
                  onKeyDown={onKeyDown}
                >
                  <span className="dispatch__thumb" aria-hidden="true">
                    <Picture image={{ ...item.image, alt: '' }} sizes="(min-width: 56em) 160px, 40vw" />
                  </span>
                  <span className="dispatch__name">{item.name}</span>
                </button>
              ))}
            </div>

            <div
              className="dispatch__detail"
              role="tabpanel"
              id={`${base}-panel`}
              aria-labelledby={`${base}-tab-${map.id}`}
              tabIndex={0}
            >
              <Art key={map.id} image={map.image} sizes={SIZES.half} variant="cover" caption={false} />
              <div className="dispatch__text">
                <p className="dispatch__kind">
                  {modes[map.mode].label}
                  {map.story && <span> · {map.story}</span>}
                </p>
                <h3 className="h-sub">{map.name}</h3>
                <p>{map.summary}</p>
                <ul className="ticks">
                  {map.highlights.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <p className="dispatch__caption">{map.image.caption}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Game page ---------- */

/** One part of the game: a picture beside what it shows. Every other one sits on a grey band, picture first. */
export function FeatureRow({ index }: { index: number }) {
  const feature = game.features[index]
  const titleId = `${feature.id}-title`

  return (
    <section
      className={index % 2 === 1 ? 'section band' : 'section'}
      id={feature.id}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <div className={index % 2 === 1 ? 'wrap split split--flip' : 'wrap split'}>
        <div className="stack">
          <p className="eyebrow">{feature.eyebrow}</p>
          <h2 className="h-section" id={titleId}>
            {feature.title}
          </h2>
          {feature.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <ul className="ticks ticks--two">
            {feature.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
        <Art image={feature.image} sizes={SIZES.half} />
      </div>
    </section>
  )
}

/** The game's stories, as three case files. */
export function CaseFiles() {
  return (
    <section className="section" aria-labelledby="cases-title">
      <div className="wrap">
        <div className="section-head">
          <h2 className="h-section" id="cases-title">
            {game.casesHeading}
          </h2>
          <p className="lede">{game.casesLede}</p>
        </div>
        <ul className="cases">
          {game.cases.map((item) => (
            <li className="case" key={item.id}>
              <p className="case__tab">Case file · {item.where}</p>
              <h3 className="case__title">{item.title}</h3>
              <p className="case__hook">{item.hook}</p>
              <p>{item.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** A short list of the game's smaller delights. */
export function Extras() {
  return (
    <section className="section" aria-labelledby="extras-title">
      <div className="wrap faq-layout">
        <h2 className="h-section" id="extras-title">
          {game.extrasHeading}
        </h2>
        <ul className="extras">
          {game.extras.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
