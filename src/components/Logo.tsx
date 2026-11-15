import { media } from '../content/media.generated.ts'

const file = media['praamix-logo']

/**
 * The supplied PRAAMIX logo, drawn as an image at its own proportions.
 * It is dark artwork on a clear background, so it only sits on light surfaces.
 * The alt text is empty because the link around it is already named.
 */
export function Logo() {
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
