import { Link, useParams } from 'react-router'
import { Action } from '../components/Action.tsx'
import { Arrow } from '../components/Arrow.tsx'
import { BadgeScene } from '../components/BadgeScene.tsx'
import { Band } from '../components/Band.tsx'
import { FaqSection } from '../components/Faq.tsx'
import { Gallery } from '../components/Gallery.tsx'
import { CaseFiles, DispatchBoard, Extras, GameStage } from '../components/GameShowcase.tsx'
import { ComingNext, Story } from '../components/GameStory.tsx'
import { Community, TrailerButton, TrailerSection } from '../components/GameFollow.tsx'
import { GameStatus, StoreLinks } from '../components/GameParts.tsx'
import { Stats, Ticker } from '../components/Motion.tsx'
import { Showroom } from '../components/Showroom.tsx'
import { gamePath, games } from '../content/game.ts'
import { metaFor, PRESS_KIT_PATH } from '../content/routes.ts'
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
        {game.trailer && <TrailerButton trailer={game.trailer} />}
      </GameStage>
      <Ticker words={game.ticker} />
      <Stats items={game.stats} label={`${game.title} in numbers`} />
      {game.trailer && <TrailerSection trailer={game.trailer} />}
      <BadgeScene />

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

      <Story />
      <Showroom {...game.showroom} />
      <CaseFiles />
      <DispatchBoard band />
      <ComingNext />
      <Gallery id="gallery" heading={game.galleryHeading} lede={game.galleryLede} images={game.gallery} />
      <Gallery
        id="key-art"
        heading={game.keyArtHeading}
        lede={game.keyArtLede}
        images={game.marquee.posters.map((poster) => poster.image)}
        ruled
      />
      <GameStatus game={game} />
      <Extras />
      <Community />
      <section className="section section--ruled" aria-label="For press and creators">
        <div className="wrap">
          <Link className="link-arrow" to={PRESS_KIT_PATH}>
            <span>Press kit: fact sheet, logo and key art for press and creators</span>
            <Arrow />
          </Link>
        </div>
      </section>
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
