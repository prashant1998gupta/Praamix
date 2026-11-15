import { useLocation } from 'react-router'
import { media } from '../content/media.generated.ts'
import { isNight } from '../content/routes.ts'

/**
 * The supplied PRAAMIX logo, drawn as an image at its own proportions. On the
 * dark pages it uses the light version: the same artwork with its charcoal
 * turned white. The alt text is empty because the link around it is named.
 */
export function Logo() {
  const { pathname } = useLocation()
  const file = isNight(pathname) ? media['praamix-logo-light'] : media['praamix-logo']

  return (
    <img
      className="logo"
      src={`${file.base}-${file.fallback}.png`}
      srcSet={file.widths.map((width) => `${file.base}-${width}.webp ${width}w`).join(', ')}
      sizes="184px"
      width={file.width}
      height={file.height}
      alt=""
      decoding="async"
    />
  )
}
