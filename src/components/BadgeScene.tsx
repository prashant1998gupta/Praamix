import { useEffect, useRef } from 'react'
import { sheriffTownVr } from '../content/game.ts'
import { images, SIZES } from '../content/images.ts'
import { Picture } from './Picture.tsx'

const game = sheriffTownVr
const picture = images.stvDistrict

/** How far in a star's inner corners sit, as a share of its points. */
const INNER = 0.46

/** The ten corners of a five-pointed star, as `x,y` pairs around a centre. */
function starPoints(cx: number, cy: number, radius: number, turn: number) {
  const points: string[] = []
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? radius : radius * INNER
    const angle = -Math.PI / 2 + (i * Math.PI) / 5 + turn
    points.push(`${(cx + r * Math.cos(angle)).toFixed(1)}px ${(cy + r * Math.sin(angle)).toFixed(1)}px`)
  }
  return points
}

/**
 * The motto, then the town seen through a sheriff's star.
 *
 * As the page scrolls, the scene holds still: the words of the motto are
 * stamped in one by one over a small star-shaped window onto the precinct
 * district, then the star opens until the picture fills the screen. GSAP
 * drives it, and is only downloaded when the scene is near.
 *
 * Without scripts, or with reduced motion requested, nothing is held or
 * hidden: the picture fills the panel and the words sit over it.
 */
export function BadgeScene() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = root.current
    if (!section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cleanup: (() => void) | undefined
    let cancelled = false

    async function start() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      if (cancelled || !section) return
      gsap.registerPlugin(ScrollTrigger)

      const stage = section.querySelector<HTMLElement>('.badge-scene__stage')!
      const window_ = section.querySelector<HTMLElement>('.badge-scene__window')!
      const edge = section.querySelector<SVGPolygonElement>('.badge-scene__edge polygon')!
      const edgeSvg = section.querySelector<SVGSVGElement>('.badge-scene__edge')!
      const img = section.querySelector<HTMLElement>('.badge-scene__window img')!
      const words = section.querySelectorAll<HTMLElement>('.badge-scene__word')
      const title = section.querySelector<HTMLElement>('.badge-scene__title')!
      const after = section.querySelectorAll<HTMLElement>('.badge-scene__after')
      const shade = section.querySelector<HTMLElement>('.badge-scene__shade')!

      section.classList.add('badge-scene--live')

      /* The star's opening, from 0 (a badge) to 1 (past every corner of the screen). */
      const star = { open: 0, turn: -0.35 }
      const draw = () => {
        const w = stage.clientWidth
        const h = stage.clientHeight
        const small = Math.min(w, h) * 0.3
        const cover = Math.hypot(w, h) / 2 / INNER + 40
        const radius = small + (cover - small) * star.open ** 2
        const points = starPoints(w / 2, h * 0.5, radius, star.turn)
        window_.style.clipPath = `polygon(${points.join(', ')})`
        edgeSvg.setAttribute('viewBox', `0 0 ${w} ${h}`)
        edge.setAttribute('points', points.map((p) => p.replaceAll('px', '')).join(' '))
      }

      const context = gsap.context(() => {
        gsap.set(words, { yPercent: 70, opacity: 0, scale: 1.6 })
        gsap.set(after, { y: 24, opacity: 0 })
        gsap.set(img, { scale: 1.45 })
        gsap.set(shade, { opacity: 0 })
        gsap.set(edge, { strokeDasharray: 1, strokeDashoffset: 1 })
        draw()

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=240%',
            pin: stage,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onRefresh: draw,
          },
        })

        timeline
          /* The badge is drawn, and the motto stamped in, a word at a time. */
          .to(edge, { strokeDashoffset: 0, duration: 0.6, ease: 'power1.inOut' }, 0)
          .to(star, { turn: 0, duration: 1, onUpdate: draw }, 0)
          .to(words, { yPercent: 0, opacity: 1, scale: 1, duration: 0.25, stagger: 0.18, ease: 'back.out(2)' }, 0.15)
          /* The star opens onto the town. */
          .to(star, { open: 1, duration: 1.1, ease: 'power2.in', onUpdate: draw }, 1.1)
          .to(edgeSvg, { opacity: 0, duration: 0.3 }, 1.8)
          .to(img, { scale: 1, duration: 1.4, ease: 'power1.out' }, 1.1)
          .to(title, { scale: 0.62, yPercent: -95, duration: 0.8, ease: 'power2.inOut' }, 1.6)
          .to(shade, { opacity: 1, duration: 0.6 }, 1.7)
          /* What the picture is, and where every shift starts. */
          .to(after, { y: 0, opacity: 1, duration: 0.35, stagger: 0.12 }, 2.2)
          .to({}, { duration: 0.4 })
      }, section)

      cleanup = () => {
        context.revert()
        section.classList.remove('badge-scene--live')
        window_.style.clipPath = ''
      }
    }

    /* Download GSAP only when the scene is most of a screen away. */
    const near = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        near.disconnect()
        void start()
      },
      { rootMargin: '75% 0px' },
    )
    near.observe(section)

    return () => {
      cancelled = true
      near.disconnect()
      cleanup?.()
    }
  }, [])

  const words = game.motto.split(' ')

  return (
    <section className="badge-scene" ref={root} aria-labelledby="badge-scene-title">
      <div className="badge-scene__stage">
        <div className="badge-scene__window">
          <Picture image={picture} sizes={SIZES.marquee} />
        </div>
        <div className="badge-scene__shade" />
        <svg className="badge-scene__edge" aria-hidden="true" preserveAspectRatio="none">
          <polygon pathLength={1} />
        </svg>
        <div className="badge-scene__text">
          <h2 className="badge-scene__title" id="badge-scene-title">
            {words.map((word, index) => (
              <span key={index}>
                {index > 0 && ' '}
                <span className="badge-scene__word">{word}</span>
              </span>
            ))}
          </h2>
        </div>
        <div className="badge-scene__foot">
          <p className="badge-scene__after badge-scene__line">{game.dispatch.lede}</p>
          <p className="badge-scene__after badge-scene__caption">{picture.caption}</p>
        </div>
      </div>
    </section>
  )
}
