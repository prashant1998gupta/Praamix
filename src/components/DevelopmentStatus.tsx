import { site } from '../content/site.ts'
import type { Game } from '../content/site.ts'
import { Arrow } from './Arrow.tsx'

/** Where the game stands. Store links appear only when real URLs are supplied. */
export function DevelopmentStatus({ game }: { game: Game }) {
  const { development, storeLinks } = game

  return (
    <section className="status" aria-labelledby="status-heading">
      <div className="wrap">
        <div className="status__grid">
          <h2 className="kicker status__heading" id="status-heading">
            {development.heading}
          </h2>
          <dl className="status__facts">
            {development.facts.map((fact) => (
              <div className="status__fact" key={fact.term}>
                <dt className="kicker">{fact.term}</dt>
                <dd>{fact.detail}</dd>
              </div>
            ))}
          </dl>
          {development.note && <p className="status__note">{development.note}</p>}
          {storeLinks.length > 0 && (
            <div className="status__stores">
              <h3 className="kicker">{site.gamePage.storesHeading}</h3>
              <ul className="status__store-list">
                {storeLinks.map((link) => (
                  <li key={link.url}>
                    <a className="action" href={link.url} rel="noopener noreferrer">
                      <span>{link.label}</span>
                      <Arrow />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
