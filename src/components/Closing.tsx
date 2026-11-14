import type { ReactNode } from 'react'
import { site } from '../content/site.ts'

type Props = {
  children: ReactNode
  /** Makes the section a link target, e.g. "contact" for /#contact. */
  id?: string
  labelledBy?: string
  label?: string
}

/** The dark band that ends both pages. */
export function Closing({ children, id, labelledBy, label }: Props) {
  return (
    <section
      className="closing on-ink"
      id={id}
      tabIndex={id ? -1 : undefined}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : label}
    >
      <div className="wrap">
        <div className="closing__grid">
          <p className="closing__line">{site.closingLine}</p>
          <div className="closing__side">{children}</div>
        </div>
      </div>
    </section>
  )
}
