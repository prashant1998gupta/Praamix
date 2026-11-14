import { Link } from 'react-router'
import { Arrow } from '../components/Arrow.tsx'
import { Closing } from '../components/Closing.tsx'
import { GameFeature } from '../components/GameFeature.tsx'
import { Wordmark } from '../components/Wordmark.tsx'
import { gamePath, games, site } from '../content/site.ts'
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts'

export function Home() {
  useDocumentMeta(`${site.name} · ${site.descriptor}`, site.description)

  const { hero, games: gamesCopy, studio } = site.home
  const { contact } = site
  const firstGame = games[0]
  const hasContact = contact.email !== '' || contact.links.length > 0

  return (
    <main id="main" className="home" tabIndex={-1}>
      <section className="hero" aria-labelledby="masthead">
        <div className="wrap">
          <div className="hero__layout">
            <div className="masthead">
              <h1 className="masthead__word" id="masthead">
                <Wordmark />
              </h1>
            </div>
            <div className="hero__deck">
              <p className="kicker hero__descriptor">{site.descriptor}</p>
              <p className="hero__statement">{hero.statement}</p>
              {firstGame && (
                <Link className="action hero__action" to={gamePath(firstGame)}>
                  <span>{hero.actionLabel}</span>
                  <Arrow />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="feature" id="games" tabIndex={-1} aria-labelledby="games-heading">
        <div className="wrap">
          <div className="section-head">
            <h2 className="kicker" id="games-heading">
              {gamesCopy.heading}
            </h2>
          </div>
          {games.map((game, index) => (
            <GameFeature key={game.slug} game={game} index={index} />
          ))}
        </div>
      </section>

      <section className="studio" id="studio" tabIndex={-1} aria-labelledby="studio-heading">
        <div className="wrap">
          <div className="studio__grid">
            <h2 className="kicker studio__heading" id="studio-heading">
              {studio.heading}
            </h2>
            <p className="studio__lead">{studio.lead}</p>
            <div className="prose studio__body">
              {studio.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Closing id="contact" labelledBy="contact-heading">
        <h2 className="kicker" id="contact-heading">
          {contact.heading}
        </h2>
        {hasContact ? (
          <ul className="contact-list">
            {contact.email !== '' && (
              <li>
                <a className="contact-list__link" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </li>
            )}
            {contact.links.map((link) => (
              <li key={link.url}>
                <a className="contact-list__link" href={link.url} rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="closing__note">{contact.emptyNote}</p>
        )}
      </Closing>
    </main>
  )
}
