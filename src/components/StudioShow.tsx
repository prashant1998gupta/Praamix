import { Link } from 'react-router'
import { gamePath, sheriffTownVr } from '../content/game.ts'
import { SIZES, images } from '../content/images.ts'
import { studio } from '../content/studio.ts'
import type { SiteImage } from '../content/types.ts'
import { Arrow } from './Arrow.tsx'
import { Lines } from './Lines.tsx'
import { Picture } from './Picture.tsx'

/* ---------- The opening: two doors, ours and yours ---------- */

type DoorProps = {
  kind: 'ours' | 'yours'
  to: string
  number: string
  label: string
  word: string
  text: string
  action: string
  image: SiteImage
}

function Door({ kind, to, number, label, word, text, action, image }: DoorProps) {
  return (
    <Link className={`door door--${kind}`} to={to} viewTransition>
      <span className="door__art" aria-hidden="true">
        <Picture image={{ ...image, alt: '' }} sizes={SIZES.half} priority={kind === 'ours'} />
      </span>
      <span className="door__shade" aria-hidden="true" />
      <span className="door__label">
        <span className="door__number">{number}</span>
        {label}
      </span>
      <span className="door__word">{word}</span>
      <span className="door__text">{text}</span>
      <span className="door__go">
        {action}
        <Arrow />
      </span>
      <span className="door__kind">{image.caption}</span>
    </Link>
  )
}

/**
 * The top of the studio page. The studio does two kinds of work, so the page
 * opens on two doors: the game we are making, and the games we make for
 * clients. On wide screens the door under the pointer opens wider.
 */
export function Doors() {
  const [ours, yours] = studio.make.items

  return (
    <section className="doors" aria-labelledby="studio-title">
      <div className="wrap">
        <div className="doors__head">
          <p className="eyebrow">{studio.eyebrow}</p>
          <h1 className="doors__title" id="studio-title">
            <Lines lines={studio.title} />
          </h1>
          <p className="lede">{studio.lede}</p>
        </div>
        <div className="doors__pair">
          <Door
            kind="ours"
            to={gamePath(sheriffTownVr)}
            number="01"
            label={ours.title}
            word="Ours"
            text={ours.text}
            action={ours.action}
            image={images.stvLineup}
          />
          <Door
            kind="yours"
            to="/services"
            number="02"
            label={yours.title}
            word="Yours"
            text={yours.text}
            action={yours.action}
            image={images.artSequence}
          />
        </div>
      </div>
    </section>
  )
}

/* ---------- What is on the workbench: a moving strip of in-game captures ---------- */

const STRIP = [
  images.stvArrival,
  images.stvFunCourt,
  images.stvBottleTrap,
  images.stvDistrict,
  images.stvExperiments,
  images.stvShop,
]

/** In-game captures moving past in a row. They are decoration here; the link beside them leads to the game. */
export function CaptureStrip() {
  const { bench } = studio
  const run = (
    <ul className="strip__run">
      {STRIP.map((image) => (
        <li key={image.file.base}>
          <Picture image={{ ...image, alt: '' }} sizes="(min-width: 56em) 420px, 70vw" />
        </li>
      ))}
    </ul>
  )

  return (
    <section className="strip" aria-labelledby="bench-title">
      <div className="wrap section-head section-head--row">
        <div>
          <p className="eyebrow">{bench.eyebrow}</p>
          <h2 className="h-section" id="bench-title">
            {bench.heading}
          </h2>
        </div>
        <Link className="link-arrow" to={gamePath(sheriffTownVr)} viewTransition>
          <span>{bench.action}</span>
          <Arrow />
        </Link>
      </div>
      <div className="strip__window" aria-hidden="true">
        <div className="strip__track">
          {run}
          {run}
        </div>
      </div>
      <p className="wrap art__caption">{images.stvArrival.caption}</p>
    </section>
  )
}
