import type { CSSProperties, ReactNode } from 'react'
import { SIZES } from '../content/images.ts'
import type { SiteImage } from '../content/types.ts'
import { useDrift } from '../hooks/useDrift.ts'
import { Lines } from './Lines.tsx'
import { Art } from './Picture.tsx'

type Props = {
  /** Ties the section to its heading. */
  id: string
  eyebrow?: string
  title: string[]
  /** Width of the longest title line, in em. The heading is sized so that line fits its column. */
  fit?: number
  image: SiteImage
  /**
   * open   the picture sits straight on the page and drifts slightly with the pointer
   * panel  the picture sits in a rounded panel and stays still
   */
  variant?: 'open' | 'panel'
  /** Everything under the heading: text and actions. */
  children: ReactNode
}

/** The top of a page: a heading and text on one side, the page's main picture on the other. */
export function PageHero({ id, eyebrow, title, fit, image, variant = 'open', children }: Props) {
  const zone = useDrift<HTMLElement>()
  const style = fit ? ({ '--fit': fit } as CSSProperties) : undefined

  return (
    <section className="hero" aria-labelledby={id} ref={zone}>
      <div className="wrap hero__grid">
        <div className="hero__text" style={style}>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="h-page" id={id}>
            <Lines lines={title} />
          </h1>
          {children}
        </div>
        <Art
          className="hero__art"
          image={image}
          sizes={SIZES.hero}
          variant={variant}
          drift={variant === 'open'}
          priority
        />
      </div>
    </section>
  )
}
