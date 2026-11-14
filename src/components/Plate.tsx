import type { CSSProperties } from 'react'
import type { ImageCrop, MediaSlot } from '../content/site.ts'
import { NATURAL_MAX_HEIGHT, TALL_RATIO } from './frames.ts'
import type { Frame, Slot } from './frames.ts'

type Props = {
  slot: MediaSlot
  /** Where the frame sits in the layout. See frames.ts. */
  frame: Frame
  /** True for the one image at the top of a page: it loads first. */
  priority?: boolean
  /** Show the whole image at its own proportions instead of cropping to the frame. */
  natural?: boolean
}

const fileFor = (crop: ImageCrop, width: number) => `${crop.base}-${width}.webp`

const toSrcSet = (crop: ImageCrop) =>
  crop.widths.map((width) => `${fileFor(crop, width)} ${width}w`).join(', ')

/** Writes a list of slots as an HTML `sizes` value. */
const toSizes = (slots: Slot[], adjust = (width: string) => width) =>
  slots.map((slot) => (slot.media ? `${slot.media} ` : '') + adjust(slot.width)).join(', ')

/**
 * A media frame. With a real image it serves the smallest file that fills the
 * frame on the current screen. Without one it shows a placeholder that says so.
 */
export function Plate({ slot, frame, priority = false, natural = false }: Props) {
  const { image, label } = slot

  if (!image || image.landscape.widths.length === 0) {
    return (
      <div
        className="plate plate--pending"
        role="img"
        aria-label={`Placeholder for ${label}. No image from the game has been added yet.`}
      >
        <div className="plate__slip" aria-hidden="true">
          <span className="plate__tag">Image pending</span>
          <span className="plate__label">{label}</span>
          <span className="plate__fine">For placement only. Not game footage.</span>
        </div>
      </div>
    )
  }

  const { landscape, portrait } = image
  const fallback = fileFor(landscape, landscape.widths[Math.floor(landscape.widths.length / 2)])
  const aspect = landscape.width / landscape.height

  /* Shown whole: the frame takes the image's own shape, capped so it never outgrows the screen. */
  const cap = (NATURAL_MAX_HEIGHT * aspect).toFixed(1)
  const naturalStyle = {
    '--plate-ratio': `${landscape.width} / ${landscape.height}`,
    '--plate-cap': `${cap}svh`,
  } as CSSProperties

  /*
   * Tell the browser how wide the image is drawn, so it fetches a file to suit.
   * Where the frame is taller than wide, the portrait crop is used. Without
   * one, the wide image has to be drawn larger than the frame to fill it, so
   * the browser is told to fetch a correspondingly larger file.
   */
  const tall = natural ? [] : (frame.tall ?? [])
  const stretch = (aspect / TALL_RATIO).toFixed(2)
  let imgSizes = toSizes(frame.wide)
  if (natural) {
    imgSizes = toSizes(frame.wide, (width) => `min(${width}, ${cap}vh)`)
  } else if (!portrait) {
    const stretched = tall.map((slot) => ({ ...slot, width: `calc(${slot.width} * ${stretch})` }))
    imgSizes = toSizes([...stretched, ...frame.wide])
  }

  return (
    <div
      className="plate"
      data-crop={natural ? 'natural' : portrait ? 'portrait' : 'landscape'}
      style={natural ? naturalStyle : undefined}
    >
      <picture>
        {portrait && tall.length > 0 && (
          <source
            media={tall.map((entry) => entry.media).join(', ')}
            srcSet={toSrcSet(portrait)}
            sizes={toSizes([...tall, { width: '100vw' }])}
            width={portrait.width}
            height={portrait.height}
          />
        )}
        <img
          className="plate__img"
          src={fallback}
          srcSet={toSrcSet(landscape)}
          sizes={imgSizes}
          width={landscape.width}
          height={landscape.height}
          alt={image.alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          style={image.focus ? { objectPosition: image.focus } : undefined}
        />
      </picture>
    </div>
  )
}
