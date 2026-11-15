import { Action } from './Action.tsx'

type BandItem = {
  title: string
  text: string
  action: string
  to: string
  variant?: 'light' | 'accent'
  back?: boolean
}

/** The dark band that closes a page: one next step, or two side by side. */
export function Band({ label, items }: { label: string; items: BandItem[] }) {
  return (
    <section className="cta on-ink" aria-label={label}>
      <div className="wrap cta__grid" data-count={items.length}>
        {items.map((item) => (
          <div className="cta__item" key={item.title}>
            <div>
              <h2 className="cta__title">{item.title}</h2>
              <p className="cta__text">{item.text}</p>
            </div>
            <Action to={item.to} variant={item.variant ?? 'light'} back={item.back}>
              {item.action}
            </Action>
          </div>
        ))}
      </div>
    </section>
  )
}
