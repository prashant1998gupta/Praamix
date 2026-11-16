/*
 * The two game pieces in the Praamix logo, and how other parts of the site
 * talk to them.
 */

/** Which piece: 0 is the white one, 1 the orange one. */
export type PieceIndex = 0 | 1

export const PIECE_EVENT = 'praamix:piece'

/** Asks the logo in the header to make one of its pieces jump. */
export function nudgePiece(piece: PieceIndex) {
  document.dispatchEvent(new CustomEvent<PieceIndex>(PIECE_EVENT, { detail: piece }))
}

export const motionAllowed = () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* A jump with a turn in the air. */
const JUMP: Keyframe[] = [
  { transform: 'translateY(0) rotate(0deg)', easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' },
  { transform: 'translateY(-0.62em) rotate(200deg)', offset: 0.45, easing: 'cubic-bezier(0.6, 0, 0.8, 0.5)' },
  { transform: 'translateY(0) rotate(360deg)', offset: 0.82 },
  { transform: 'translateY(-0.08em) rotate(360deg)', offset: 0.91 },
  { transform: 'translateY(0) rotate(360deg)' },
]

/** Makes one piece of a logo jump. Nothing moves when reduced motion is requested. */
export function jumpPiece(logo: Element | null, piece: number, delay = 0) {
  if (!logo || !motionAllowed()) return
  logo.querySelectorAll('.piece')[piece]?.animate(JUMP, { duration: 760, delay })
}

/** When the site opens, the two pieces are set down on the board, one after the other. */
export function dropPieces(logo: Element | null) {
  if (!logo || !motionAllowed()) return
  logo.querySelectorAll('.piece').forEach((piece, index) => {
    piece.animate([{ opacity: 0, transform: 'translateY(-1.4em)' }, { opacity: 1, transform: 'translateY(0)' }], {
      duration: 750,
      delay: 450 + index * 200,
      easing: 'cubic-bezier(0.25, 1.5, 0.45, 1)',
      fill: 'backwards',
    })
  })
}

/* Up, up, down, down, left, right, left, right, B, A. */
export const CHEAT = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
