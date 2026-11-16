import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router'
import { CHEAT, PIECE_EVENT, dropPieces, jumpPiece, motionAllowed } from '../hooks/pieces.ts'
import type { PieceIndex } from '../hooks/pieces.ts'

/*
 * The Praamix logo: the name, with its two A's drawn as two game pieces, one
 * white and one orange. Two players, side by side.
 *
 * The letters are real text in the site's own typeface. The pieces are small
 * drawings that stand on the same line and rise to the same height as the
 * letters. The same drawing is used for the browser tab icon
 * (scripts/make-icons.mjs) and the loader (index.html).
 */

/* A game piece: a round head on a body that widens to the base, like an A with no bar. */
const HEAD = { cx: 13, cy: 6.6, r: 6.6 }
const BODY = 'M0.6 30 8.2 11.8h9.6L25.4 30z'

/** One piece by itself, for use beside a person or in a badge. */
export function Piece({ index, className }: { index: PieceIndex; className?: string }) {
  return (
    <svg
      className={['piece', `piece--${index + 1}`, className].filter(Boolean).join(' ')}
      viewBox="0 0 26 30"
      aria-hidden="true"
      focusable="false"
    >
      <circle {...HEAD} />
      <path d={BODY} />
    </svg>
  )
}

type Props = {
  /**
   * For the logo in the header, which is alive:
   *   - the pieces drop into place when the site opens
   *   - they lean towards the pointer
   *   - they take turns: each page a visitor opens, the next piece jumps
   *   - a part of the site can make one jump (see nudgePiece in hooks/pieces.ts)
   *   - the old cheat code makes them both go, and says so
   */
  live?: boolean
  /** One piece knocked over. For the page that is not there. */
  fallen?: boolean
  className?: string
}

/**
 * The logo. It is decorative wherever it is used: the link or heading around
 * it carries the name in words.
 */
export function Logo({ live = false, fallen = false, className }: Props) {
  const root = useRef<HTMLSpanElement>(null)
  const { pathname } = useLocation()
  const turn = useRef(0)
  const opened = useRef(false)
  const [cheated, setCheated] = useState(false)

  /* Before the first paint, so the pieces are never seen standing there and then dropped. */
  useLayoutEffect(() => {
    if (live) dropPieces(root.current)
  }, [live])

  /* Taking turns: every page opened is a move, and the pieces alternate. The first page is the arrival, not a move. */
  useEffect(() => {
    if (!live) return
    if (!opened.current) {
      opened.current = true
      return
    }
    jumpPiece(root.current, turn.current % 2)
    turn.current += 1
  }, [live, pathname])

  useEffect(() => {
    if (!live) return
    const element = root.current
    if (!element) return

    const onPiece = (event: Event) => jumpPiece(element, (event as CustomEvent<PieceIndex>).detail)

    /* The pieces lean towards the pointer, a little, and stand up again when it goes. */
    let frame = 0
    const onMove = (event: PointerEvent) => {
      if (frame || event.pointerType !== 'mouse') return
      frame = requestAnimationFrame(() => {
        frame = 0
        const box = element.getBoundingClientRect()
        const dx = event.clientX - (box.left + box.width / 2)
        const dy = event.clientY - (box.top + box.height / 2)
        /* Strongest nearby, fading out with distance. */
        const near = Math.max(0, 1 - Math.hypot(dx, dy) / 520)
        element.style.setProperty('--lean', (Math.max(-1, Math.min(1, dx / 160)) * near).toFixed(3))
      })
    }
    const onLeave = () => element.style.setProperty('--lean', '0')

    /* The cheat code. It is ignored while someone is typing into a field. */
    let step = 0
    let timer = 0
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable]')) return
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
      step = key === CHEAT[step] ? step + 1 : key === CHEAT[0] ? 1 : 0
      if (step < CHEAT.length) return
      step = 0
      jumpPiece(element, 0)
      jumpPiece(element, 1, 140)
      setCheated(true)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setCheated(false), 4200)
    }

    document.addEventListener(PIECE_EVENT, onPiece)
    document.addEventListener('keydown', onKey)
    if (motionAllowed()) {
      window.addEventListener('pointermove', onMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onLeave)
    }
    return () => {
      document.removeEventListener(PIECE_EVENT, onPiece)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [live])

  return (
    <>
      <span
        ref={root}
        className={['wordmark', className].filter(Boolean).join(' ')}
        data-fallen={fallen ? '' : undefined}
        aria-hidden="true"
      >
        <span>PR</span>
        <Piece index={0} />
        <Piece index={1} />
        <span>MIX</span>
      </span>
      {/* Outside the link the logo sits in, and always present, so a screen reader announces the message when it arrives. */}
      {live &&
        createPortal(
          <p className="cheat" role="status" data-shown={cheated ? '' : undefined}>
            {cheated && 'Cheat code accepted. Player two has joined.'}
          </p>,
          document.body,
        )}
    </>
  )
}
