import { Link, useParams } from 'react-router'
import { Arrow } from '../components/Arrow.tsx'
import { Closing } from '../components/Closing.tsx'
import { DevelopmentStatus } from '../components/DevelopmentStatus.tsx'
import { heroFrame } from '../components/frames.ts'
import { GameGallery } from '../components/GameGallery.tsx'
import { GameTitle } from '../components/GameTitle.tsx'
import { Plate } from '../components/Plate.tsx'
import { WeightedFrame } from '../components/WeightedFrame.tsx'
import { games, site } from '../content/site.ts'
import type { Game as GameContent } from '../content/site.ts'
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts'
import { useWeight } from '../hooks/useWeight.ts'
import { NotFound } from './NotFound.tsx'

export function Game() {
  const { slug } = useParams()
  const game = games.find((entry) => entry.slug === slug)

  return game ? <GamePage game={game} /> : <NotFound />
}

function GamePage({ game }: { game: GameContent }) {
  useDocumentMeta(`${game.title} · ${site.name}`, game.summary)

  const zone = useWeight<HTMLElement>()
  const number = String(games.indexOf(game) + 1).padStart(2, '0')
  const labels = site.gamePage
  const { hero, pendingNote } = game.media
  const caption = hero.image ? hero.image.caption : pendingNote

  return (
    <main id="main" className="game" tabIndex={-1}>
      <div className="game-hero">
        <div className="wrap">
          <div className="game-hero__layout">
            <div className="game-hero__meta">
              <p className="kicker game-hero__crumb">
                <Link className="crumb" to="/#games">
                  {labels.crumb}
                </Link>
                <span aria-hidden="true">/ {number}</span>
              </p>
              <p className="kicker status-flag">{game.status}</p>
            </div>

            <GameTitle game={game} level={1} className="game-hero__title" />

            <p className="game-hero__standfirst">{game.standfirst}</p>

            <figure className="game-hero__figure" ref={zone}>
              <WeightedFrame>
                <Plate slot={hero} frame={heroFrame} priority />
              </WeightedFrame>
              {caption && <figcaption className="caption">{caption}</figcaption>}
            </figure>
          </div>
        </div>
      </div>

      <section className="game-intro" aria-labelledby="intro-heading">
        <div className="wrap">
          <div className="game-intro__grid">
            <h2 className="kicker" id="intro-heading">
              {labels.introHeading}
            </h2>
            <div className="game-intro__body">
              {game.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="identity" aria-labelledby="identity-heading">
        <div className="wrap">
          <div className="section-head">
            <h2 className="kicker" id="identity-heading">
              {game.identityHeading}
            </h2>
          </div>
          <ol className="identity__list">
            {game.identity.map((entry, index) => (
              <li
                className={entry.key ? 'identity__item identity__item--key' : 'identity__item'}
                key={entry.title}
              >
                <span className="kicker identity__num" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="identity__title">{entry.title}</h3>
                <p className="identity__body">{entry.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <GameGallery game={game} />
      <DevelopmentStatus game={game} />

      <Closing label={labels.closingLabel}>
        <Link className="action" to="/">
          <Arrow back />
          <span>{labels.backLabel}</span>
        </Link>
      </Closing>
    </main>
  )
}
