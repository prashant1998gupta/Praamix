import type { ExternalLink, StoreEntry } from '../content/types.ts'
import { ExternalAction } from './Action.tsx'

/* The wording follows what the store listing really is. */
const WORDING: Record<StoreEntry['state'], string> = {
  available: 'Buy on',
  wishlist: 'Wishlist on',
  preorder: 'Pre-order on',
}

/** Buttons to real store pages. Shows nothing at all until a store is configured. */
export function StoreLinks({ stores }: { stores: StoreEntry[] }) {
  if (stores.length === 0) return null

  return (
    <ul className="stores">
      {stores.map((entry) => (
        <li key={entry.url}>
          <ExternalAction href={entry.url} variant="accent">
            {entry.label ?? `${WORDING[entry.state]} ${entry.store}`}
            {entry.platform && ` (${entry.platform})`}
          </ExternalAction>
          {entry.price && <span className="stores__price">{entry.price}</span>}
        </li>
      ))}
    </ul>
  )
}

type StatusProps = {
  game: {
    development: { heading: string; note: string }
    availability: { heading: string; none: string }
    glance: { term: string; detail: string }[]
    stores: StoreEntry[]
    updates: ExternalLink | null
  }
}

/** Where development stands, and where the game can be bought once it can be. */
export function GameStatus({ game }: StatusProps) {
  const { development, availability, stores, updates } = game
  const status = game.glance.filter((fact) =>
    ['Status', 'Development targets', 'Release date'].includes(fact.term),
  )

  return (
    <section className="section band" aria-labelledby="status-title">
      <div className="wrap duo">
        <div className="duo__item">
          <h2 className="h-sub" id="status-title">
            {development.heading}
          </h2>
          <dl className="facts-list facts-list--tight">
            {status.map((fact) => (
              <div key={fact.term}>
                <dt className="label">{fact.term}</dt>
                <dd>{fact.detail}</dd>
              </div>
            ))}
          </dl>
          <p className="quiet">{development.note}</p>
        </div>
        <div className="duo__item">
          <h2 className="h-sub">{availability.heading}</h2>
          {stores.length > 0 ? <StoreLinks stores={stores} /> : <p>{availability.none}</p>}
          {updates && (
            <ExternalAction href={updates.url} variant="text">
              {updates.label}
            </ExternalAction>
          )}
        </div>
      </div>
    </section>
  )
}
