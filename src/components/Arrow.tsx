type Props = { back?: boolean }

/** Drawn rather than typed, so it looks the same on every device. */
export function Arrow({ back = false }: Props) {
  return (
    <svg
      className={back ? 'arrow arrow--back' : 'arrow'}
      viewBox="0 0 28 12"
      width="28"
      height="12"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 6h26M21 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  )
}
