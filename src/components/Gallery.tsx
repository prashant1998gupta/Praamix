import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { SIZES } from '../content/images.ts'
import type { SiteImage } from '../content/types.ts'
import { Arrow } from './Arrow.tsx'
import { Picture } from './Picture.tsx'

type Props = { id: string; heading: string; lede: string; images: SiteImage[] }

/**
 * A grid of pictures. Selecting one opens it large in a dialog, where the
 * arrow keys or the buttons move to the next and previous picture and Escape
 * closes it. Focus goes back to the picture that opened it.
 */
export function Gallery({ id, heading, lede, images }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLButtonElement | null>(null)
  const [index, setIndex] = useState(0)
  const image = images[index]
  const titleId = `${id}-title`

  const open = (next: number, button: HTMLButtonElement) => {
    opener.current = button
    setIndex(next)
    dialog.current?.showModal()
  }

  const step = (by: number) => setIndex((now) => (now + by + images.length) % images.length)

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') step(1)
    else if (event.key === 'ArrowLeft') step(-1)
    else return
    event.preventDefault()
  }

  return (
    <section className="section" id={id} aria-labelledby={titleId} tabIndex={-1}>
      <div className="wrap">
        <div className="section-head">
          <h2 className="h-section" id={titleId}>
            {heading}
          </h2>
          <p className="lede">{lede}</p>
        </div>
        <ul className="shots">
          {images.map((item, itemIndex) => (
            <li key={item.file.base}>
              <button
                className="shot"
                data-tilt=""
                type="button"
                style={{ background: item.tone }}
                onClick={(event) => open(itemIndex, event.currentTarget)}
              >
                <Picture image={item} sizes={SIZES.card} />
                <span className="visually-hidden">, view larger</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialog}
        className="viewer on-ink"
        aria-label={`${heading} Picture ${index + 1} of ${images.length}`}
        onKeyDown={onKeyDown}
        onClose={() => opener.current?.focus()}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current?.close()
        }}
      >
        <div className="viewer__inner">
          <div className="viewer__bar">
            <p className="viewer__count">
              {index + 1} of {images.length}
            </p>
            <button className="viewer__close" type="button" onClick={() => dialog.current?.close()}>
              Close
            </button>
          </div>
          <figure className="viewer__figure">
            {/* The caption below describes the picture, so the picture itself stays silent. */}
            <Picture key={image.file.base} image={{ ...image, alt: '' }} sizes={SIZES.wide} />
            <figcaption>
              <span>{image.alt}</span>
              <span className="viewer__kind">{image.caption}</span>
            </figcaption>
          </figure>
          <div className="viewer__nav">
            <button className="btn btn--light" type="button" onClick={() => step(-1)}>
              <Arrow back />
              <span>Previous</span>
            </button>
            <button className="btn btn--light" type="button" onClick={() => step(1)}>
              <span>Next</span>
              <Arrow />
            </button>
          </div>
        </div>
      </dialog>
    </section>
  )
}
