import { useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { SIZES, images } from '../content/images.ts'
import type { ImageName } from '../content/images.ts'
import { Art } from './Picture.tsx'

type Chapter = { id: string; label: string; title: string; body: string[]; image: ImageName }

/**
 * Chapters shown one at a time. Choosing one changes the close-up and the
 * text beside it. The tabs follow the standard keyboard pattern: Tab reaches
 * the selected tab, the arrow keys, Home and End move between tabs.
 */
export function Chapters({ label, chapters }: { label: string; chapters: Chapter[] }) {
  const [active, setActive] = useState(0)
  const base = useId()
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const chapter = chapters[active]

  const onKeyDown = (event: KeyboardEvent) => {
    const last = chapters.length - 1
    const forward = active === last ? 0 : active + 1
    const backward = active === 0 ? last : active - 1
    const moves: Record<string, number> = {
      ArrowRight: forward,
      ArrowDown: forward,
      ArrowLeft: backward,
      ArrowUp: backward,
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
    <div className="chapters">
      <div className="chapters__tabs" role="tablist" aria-label={label}>
        {chapters.map((item, index) => (
          <button
            key={item.id}
            ref={(element) => {
              tabs.current[index] = element
            }}
            className="chapters__tab"
            type="button"
            role="tab"
            id={`${base}-tab-${item.id}`}
            aria-selected={index === active}
            aria-controls={`${base}-panel`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={onKeyDown}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        className="chapters__panel"
        role="tabpanel"
        id={`${base}-panel`}
        aria-labelledby={`${base}-tab-${chapter.id}`}
        tabIndex={0}
      >
        <Art key={chapter.id} image={images[chapter.image]} sizes={SIZES.panel} variant="cover" />
        <div className="chapters__text">
          <p className="chapters__count">
            {active + 1} of {chapters.length}
          </p>
          <h3 className="h-sub">{chapter.title}</h3>
          {chapter.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
