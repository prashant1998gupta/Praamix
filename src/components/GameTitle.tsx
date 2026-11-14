import { Fragment } from 'react'
import type { CSSProperties } from 'react'
import type { Game } from '../content/site.ts'
import { titleFit } from './titleMetrics.ts'

type Props = {
  game: Game
  /** Heading level: 1 on the game's own page, 3 in the homepage list. */
  level: 1 | 3
  /** Lets a link around the title take its name from it. */
  id?: string
  className?: string
}

/**
 * A game title set as large as its column allows: one word per line on narrow
 * screens, the whole title on one line on wide ones. It passes the measured
 * width of the title to CSS, which works out the type size.
 */
export function GameTitle({ game, level, id, className }: Props) {
  const Heading = level === 1 ? 'h1' : 'h3'
  const fit = titleFit(game.title, game.accentWord)
  const style = { '--fit-stacked': fit.stacked, '--fit-line': fit.line } as CSSProperties

  return (
    <div className={className ? `title-fit ${className}` : 'title-fit'} style={style}>
      <Heading className="game-title" id={id}>
        {game.title.split(' ').map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            {index > 0 && ' '}
            {word === game.accentWord ? (
              <em className="game-title__word game-title__accent">{word}</em>
            ) : (
              <span className="game-title__word">{word}</span>
            )}
          </Fragment>
        ))}
      </Heading>
    </div>
  )
}
