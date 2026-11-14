import { useId } from 'react'
import { Link } from 'react-router'
import { gamePath, site } from '../content/site.ts'
import type { Game } from '../content/site.ts'
import { useWeight } from '../hooks/useWeight.ts'
import { Arrow } from './Arrow.tsx'
import { featureFrame } from './frames.ts'
import { GameTitle } from './GameTitle.tsx'
import { Plate } from './Plate.tsx'
import { WeightedFrame } from './WeightedFrame.tsx'

type Props = { game: Game; index: number }

/**
 * A game on the homepage. One link wraps the whole composition, so a tap or
 * click anywhere opens the game page. It is named after the game's title, so
 * keyboard and screen reader users meet a single, clearly named link.
 */
export function GameFeature({ game, index }: Props) {
  const zone = useWeight<HTMLElement>()
  const titleId = useId()
  const number = String(index + 1).padStart(2, '0')

  return (
    <article className="feature__card" ref={zone}>
      <Link className="feature__link" to={gamePath(game)} aria-labelledby={titleId}>
        <div className="feature__head">
          <p className="kicker">
            <span className="visually-hidden">Game </span>
            {number}
          </p>
          <p className="kicker status-flag">{game.status}</p>
        </div>

        <GameTitle game={game} level={3} id={titleId} className="feature__title" />

        <WeightedFrame className="feature__media">
          <Plate slot={game.media.feature} frame={featureFrame} />
        </WeightedFrame>

        <div className="feature__text">
          <p className="feature__summary">{game.summary}</p>
          <p className="link-arrow">
            {site.home.games.actionLabel}
            <Arrow />
          </p>
        </div>
      </Link>
    </article>
  )
}
