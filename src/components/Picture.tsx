import type { CSSProperties } from 'react'
import type { ImageFile, SiteImage } from '../content/types.ts'

const srcSet = (file: ImageFile, format: string) =>
  file.widths.map((width) => `${file.base}-${width}.${format} ${width}w`).join(', ')

type PictureProps = {
  image: SiteImage
  /** How wide the picture is drawn at each screen size. See SIZES in images.ts. */
  sizes: string
  /** True for the main picture at the top of a page. It loads first; the rest wait until needed. */
  priority?: boolean
}

/**
 * One picture, offered as AVIF and WebP at several widths so each screen
 * downloads a file that suits it. The width and height reserve its space
 * before it loads, so the page does not jump.
 */
export function Picture({ image, sizes, priority = false }: PictureProps) {
  const { file } = image

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(file, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(file, 'webp')} sizes={sizes} />
      <img
        src={`${file.base}-${file.fallback}.jpg`}
        width={file.width}
        height={file.height}
        alt={image.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
    </picture>
  )
}

type ArtProps = PictureProps & {
  /**
   * open   no frame; the picture's pale backdrop fades into a white page
   * panel  a rounded panel in the picture's own backdrop colour
   * cover  a panel the picture fills, trimming its edges if the shape differs
   */
  variant?: 'open' | 'panel' | 'cover'
  /** Replaces the picture's usual caption. Pass false where a caption sits elsewhere. */
  caption?: string | false
  /** Lets the picture drift slightly with the pointer. See useDrift. */
  drift?: boolean
  className?: string
}

/** A picture with its caption. The caption says what kind of artwork it is. */
export function Art({ image, sizes, priority, variant = 'panel', caption, drift, className }: ArtProps) {
  const style = {
    '--tone': image.tone,
    '--ratio': `${image.file.width} / ${image.file.height}`,
  } as CSSProperties
  const text = caption ?? image.caption

  return (
    <figure className={['art', `art--${variant}`, className].filter(Boolean).join(' ')} style={style}>
      <div className="art__frame" data-drift={drift ? '' : undefined}>
        <Picture image={image} sizes={sizes} priority={priority} />
      </div>
      {text !== false && <figcaption className="art__caption">{text}</figcaption>}
    </figure>
  )
}
