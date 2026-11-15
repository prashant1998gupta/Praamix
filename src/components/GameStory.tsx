import { useEffect, useRef, useState } from 'react'
import { sheriffTownVr } from '../content/game.ts'
import { SIZES } from '../content/images.ts'
import { Art, Picture } from './Picture.tsx'

const game = sheriffTownVr

/* ---------- The game, told as you scroll ---------- */

/**
 * The four parts of the game. On wide screens a picture frame stays in view
 * on one side while the text scrolls past on the other, and the picture
 * changes to match the part being read. On narrow screens each part is simply
 * a picture followed by its text.
 */
export function Story() {
  const { features } = game
  const [active, setActive] = useState(0)
  const steps = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    /* The part crossing the middle of the screen is the one being read. */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = steps.current.indexOf(entry.target as HTMLElement)
          if (index >= 0) setActive(index)
        }
      },
      { rootMargin: '-48% 0px -48% 0px' },
    )
    for (const step of steps.current) if (step) observer.observe(step)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="story" aria-label="What you do in the game">
      <div className="wrap story__grid">
        <div className="story__media">
          <div className="story__frame">
            {features.map((feature, index) => (
              <div className="story__slide" key={feature.id} data-active={index === active ? '' : undefined}>
                <Picture image={feature.image} sizes={SIZES.half} />
              </div>
            ))}
            <ol className="story__dots" aria-hidden="true">
              {features.map((feature, index) => (
                <li key={feature.id} data-active={index === active ? '' : undefined} />
              ))}
            </ol>
          </div>
          <p className="art__caption">{features[active].image.caption}</p>
        </div>

        <div className="story__steps">
          {features.map((feature, index) => (
            <article
              className="story__step"
              key={feature.id}
              id={feature.id}
              tabIndex={-1}
              aria-labelledby={`${feature.id}-title`}
              data-active={index === active ? '' : undefined}
              ref={(element) => {
                steps.current[index] = element
              }}
            >
              <div className="story__inline">
                <Art image={feature.image} sizes={SIZES.half} />
              </div>
              <p className="story__number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </p>
              <p className="eyebrow">{feature.eyebrow}</p>
              <h2 className="h-section" id={`${feature.id}-title`}>
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
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- The motto, large, drifting as the page scrolls ---------- */

/** Decorative: the same words are the motto in the opening. */
export function Kinetic({ text }: { text: string }) {
  return (
    <div className="kinetic" aria-hidden="true">
      <p className="kinetic__line">
        <span>{text}</span>
        <span className="kinetic__star">★</span>
        <span>{text}</span>
        <span className="kinetic__star">★</span>
        <span>{text}</span>
      </p>
    </div>
  )
}

/* ---------- What is coming: multiplayer ---------- */

const STAR = 'M60 22 L69.4 47.1 L96.2 48.2 L75.2 64.9 L82.4 90.8 L60 76 L37.6 90.8 L44.8 64.9 L23.8 48.2 L50.6 47.1 Z'

/** Multiplayer, said plainly: it is planned, and not in the game yet. */
export function ComingNext() {
  const { multiplayer } = game

  return (
    <section className="section" id="multiplayer" aria-labelledby="multiplayer-title" tabIndex={-1}>
      <div className="wrap">
        <div className="coming on-ink">
          <div className="coming__text">
            <p>
              <span className="pill pill--ink">{multiplayer.status}</span>
            </p>
            <h2 className="h-section" id="multiplayer-title">
              {multiplayer.heading}
            </h2>
            {multiplayer.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {/* Several stars joined by a signal: more than one sheriff. Decorative. */}
          <div className="coming__art" aria-hidden="true">
            <svg viewBox="0 0 420 260">
              <defs>
                <linearGradient id="coming-gold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ffe08a" />
                  <stop offset="0.5" stopColor="#f0b43c" />
                  <stop offset="1" stopColor="#b9771a" />
                </linearGradient>
              </defs>
              <path className="coming__link" d="M95 150 Q210 20 325 150" />
              <path className="coming__link coming__link--low" d="M95 150 Q210 250 325 150" />
              <g className="coming__star coming__star--a" transform="translate(35 90)">
                <circle cx="60" cy="60" r="54" />
                <path d={STAR} fill="url(#coming-gold)" />
              </g>
              <g className="coming__star coming__star--b" transform="translate(265 90)">
                <circle cx="60" cy="60" r="54" />
                <path d={STAR} fill="url(#coming-gold)" />
              </g>
              <g className="coming__star coming__star--c" transform="translate(162 18) scale(0.8)">
                <circle cx="60" cy="60" r="54" />
                <path d={STAR} fill="url(#coming-gold)" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
