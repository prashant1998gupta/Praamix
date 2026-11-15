import { useParams } from 'react-router'
import { ExternalAction } from '../components/Action.tsx'
import { Band } from '../components/Band.tsx'
import { Chapters } from '../components/Chapters.tsx'
import { FaqSection } from '../components/Faq.tsx'
import { GameStatus, StoreLinks } from '../components/GameParts.tsx'
import { Lines } from '../components/Lines.tsx'
import { PageHero } from '../components/PageHero.tsx'
import { Art } from '../components/Picture.tsx'
import { gamePath, games } from '../content/game.ts'
import { SIZES, images } from '../content/images.ts'
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
  useDocumentMeta(metaFor(gamePath(game)))
  const facts = [...game.glance, ...game.confirmed]

  return (
    <main id="main" tabIndex={-1}>
      <PageHero
        id="game-title"
        eyebrow={game.label}
        title={[game.title]}
        fit={8.4}
        image={images.townInHands}
        variant="panel"
      >
        <p>
          <span className="pill">{game.status}</span>
        </p>
        <p className="hero__tagline">
          <Lines lines={game.tagline} />
        </p>
        <p className="lede">{game.summary}</p>
        <StoreLinks stores={game.stores} />
        {game.trailer && (
          <ExternalAction href={game.trailer.url} variant="outline">
            {game.trailer.label}
          </ExternalAction>
        )}
      </PageHero>

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

      <section className="section" aria-labelledby="chapters-title">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h-section" id="chapters-title">
              {game.chaptersHeading}
            </h2>
          </div>
          <Chapters label={game.chaptersHeading} chapters={game.chapters} />
        </div>
      </section>

      {game.gallery.length > 0 && (
        <section className="section" aria-labelledby="gallery-title">
          <div className="wrap">
            <div className="section-head">
              <h2 className="h-section" id="gallery-title">
                {game.galleryHeading}
              </h2>
            </div>
            <ul className="gallery">
              {game.gallery.map((image) => (
                <li key={image.file.base}>
                  <Art image={image} sizes={SIZES.panel} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <GameStatus game={game} />
      <FaqSection id="faq-title" heading={game.faqHeading} items={game.faq} />
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
