import { useParams } from 'react-router'
import { Action, ExternalAction } from '../components/Action.tsx'
import { Band } from '../components/Band.tsx'
import { FaqSection } from '../components/Faq.tsx'
import { Gallery } from '../components/Gallery.tsx'
import { CaseFiles, DispatchBoard, Extras, FeatureRow, GameStage } from '../components/GameShowcase.tsx'
import { GameStatus, StoreLinks } from '../components/GameParts.tsx'
import { gamePath, games } from '../content/game.ts'
import { metaFor } from '../content/routes.ts'
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts'
import { NotFound } from './NotFound.tsx'

type GameContent = (typeof games)[number]

export function Game() {
  const { slug } = useParams()
  const game = games.find((entry) => entry.slug === slug)

  return game ? <GamePage game={game} /> : <NotFound />
}

function GamePage({ game }: { game: GameContent }) {
  const path = gamePath(game)
  useDocumentMeta(metaFor(path))
  const facts = [...game.glance, ...game.confirmed]

  return (
    <main id="main" tabIndex={-1}>
      <GameStage id="game-title" eyebrow={game.label} title={game.title}>
        <p>
          <span className="pill pill--ink">{game.status}</span>
        </p>
        <p className="showcase__motto">{game.motto}</p>
        <p className="showcase__lede">{game.summary}</p>
        <StoreLinks stores={game.stores} />
        <div className="actions">
          <Action to={`${path}#maps`} variant="accent" wide>
            Pick a map
          </Action>
          <Action to={`${path}#gallery`} variant="light" wide>
            See the game
          </Action>
        </div>
        {game.trailer && (
          <ExternalAction href={game.trailer.url} variant="light">
            {game.trailer.label}
          </ExternalAction>
        )}
      </GameStage>

      <section className="section band" aria-labelledby="glance-title">
        <div className="wrap faq-layout">
          <h2 className="h-section" id="glance-title">
            {game.glanceHeading}
          </h2>
          <dl className="facts-list">
            {facts.map((fact) => (
              <div key={fact.term}>
                <dt className="label">{fact.term}</dt>
                <dd>{fact.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <FeatureRow index={0} />
      <FeatureRow index={1} />
      <CaseFiles />
      <FeatureRow index={2} />
      <FeatureRow index={3} />
      <DispatchBoard band />
      <Gallery id="gallery" heading={game.galleryHeading} lede={game.galleryLede} images={game.gallery} />
      <GameStatus game={game} />
      <Extras />
      <FaqSection id="faq-title" heading={game.faqHeading} items={game.faq} band />
      <Band
        label="More from Praamix"
        items={[
          {
            title: game.closing.title,
            text: game.closing.text,
            action: game.closing.action,
            to: '/',
            back: true,
          },
        ]}
      />
    </main>
  )
}
