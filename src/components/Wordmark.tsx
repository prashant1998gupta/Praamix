import { site } from '../content/site.ts'

/** Position of the letter that leans: the second A. */
const LEAN = 3

/**
 * The PRAAMIX wordmark. One letter has been knocked and has come to rest
 * against its neighbour. Size and width come from where it is used.
 */
export function Wordmark() {
  const word = site.wordmark

  return (
    <span className="wordmark">
      <span className="visually-hidden">{site.name}</span>
      <span className="wordmark__glyphs" aria-hidden="true">
        {word.slice(0, LEAN)}
        <span className="wordmark__a">{word.charAt(LEAN)}</span>
        {word.slice(LEAN + 1)}
      </span>
    </span>
  )
}
