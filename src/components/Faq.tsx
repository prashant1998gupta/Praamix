import type { Faq } from '../content/types.ts'

type Props = {
  id: string
  heading: string
  items: Faq[]
  /** Sets the section on the light grey band. */
  band?: boolean
}

/** Questions that open and close. Built on the browser's own disclosure element, so keyboard and touch work as standard. */
export function FaqSection({ id, heading, items, band = false }: Props) {
  return (
    <section className={band ? 'section band' : 'section'} aria-labelledby={id}>
      <div className="wrap faq-layout">
        <h2 className="h-section" id={id}>
          {heading}
        </h2>
        <div className="faq">
          {items.map((item) => (
            <details className="faq__item" key={item.question}>
              <summary className="faq__q">
                <span>{item.question}</span>
                <span className="mark" aria-hidden="true" />
              </summary>
              <p className="faq__a">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
