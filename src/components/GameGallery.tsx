import { site } from '../content/site.ts'
import type { Game } from '../content/site.ts'
import { galleryFrame } from './frames.ts'
import { Plate } from './Plate.tsx'

/** Renders nothing until the game has real images in its gallery list. */
export function GameGallery({ game }: { game: Game }) {
  const images = game.media.gallery
  if (images.length === 0) return null

  return (
    <section className="gallery" aria-labelledby="gallery-heading">
      <div className="wrap">
        <div className="section-head">
          <h2 className="kicker" id="gallery-heading">
            {site.gamePage.galleryHeading}
          </h2>
        </div>
        <ul className="gallery__grid">
          {images.map((image) => (
            <li className="gallery__item" key={image.landscape.base}>
              <figure>
                <Plate slot={{ label: image.alt, image }} frame={galleryFrame} natural />
                {image.caption && <figcaption className="caption">{image.caption}</figcaption>}
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
