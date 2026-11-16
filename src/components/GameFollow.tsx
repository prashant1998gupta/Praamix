import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { sheriffTownVr } from '../content/game.ts'
import { SIZES } from '../content/images.ts'
import type { Trailer } from '../content/types.ts'
import { Icon } from './Icon.tsx'
import { Picture } from './Picture.tsx'

const game = sheriffTownVr

/* ---------- The trailer ---------- */

/*
 * The video is YouTube's. Nothing of YouTube's is on the page until a visitor
 * presses play: only then is the player fetched, from YouTube's
 * privacy-enhanced address. Closing the player takes it off the page again,
 * which also stops the video. The Privacy Policy describes exactly this.
 */
const playerAddress = (trailer: Trailer) =>
  `https://www.youtube-nocookie.com/embed/${trailer.youtubeId}?autoplay=1&rel=0&playsinline=1`

function PlayMark() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
      <path d="M8.5 5.6v12.8a.6.6 0 0 0 .92.5l10-6.4a.6.6 0 0 0 0-1L9.42 5.1a.6.6 0 0 0-.92.5Z" fill="currentColor" />
    </svg>
  )
}

function OnYouTube({ trailer }: { trailer: Trailer }) {
  return (
    <a className="link-arrow" href={trailer.url} target="_blank" rel="noopener noreferrer">
      <span>
        Watch on YouTube
        <span className="visually-hidden"> (opens in a new tab)</span>
      </span>
      <Icon name="external" />
    </a>
  )
}

/** The player, in a dialog over the page. It exists only while it is open. */
function Player({ trailer, onClose }: { trailer: Trailer; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  /* Read once as the player opens. Without a connection there is nothing to play. */
  const [online] = useState(() => navigator.onLine)

  useEffect(() => {
    const element = dialog.current
    if (element && !element.open) element.showModal()
  }, [])

  return createPortal(
    <dialog
      ref={dialog}
      className="viewer viewer--video on-ink"
      aria-label={trailer.title}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialog.current) dialog.current?.close()
      }}
    >
      <div className="viewer__inner">
        <div className="viewer__bar">
          <p className="viewer__count">{trailer.title}</p>
          <button className="viewer__close" type="button" onClick={() => dialog.current?.close()}>
            Close
          </button>
        </div>
        <div className="viewer__frame">
          {online ? (
            <iframe
              src={playerAddress(trailer)}
              title={trailer.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <p className="viewer__offline">You’re offline. The trailer needs a connection to play.</p>
          )}
        </div>
        <OnYouTube trailer={trailer} />
      </div>
    </dialog>,
    document.body,
  )
}

/** Opens the player, and puts focus back on whatever opened it when it closes. */
function usePlayer(trailer: Trailer) {
  const [playing, setPlaying] = useState(false)
  const opener = useRef<HTMLButtonElement>(null)
  const player = playing ? (
    <Player
      trailer={trailer}
      onClose={() => {
        setPlaying(false)
        opener.current?.focus()
      }}
    />
  ) : null

  return { opener, player, play: () => setPlaying(true) }
}

/** The small play button in the opening of a page. */
export function TrailerButton({ trailer }: { trailer: Trailer }) {
  const { opener, player, play } = usePlayer(trailer)

  return (
    <>
      <button ref={opener} className="play-link" type="button" onClick={play}>
        <span className="play-link__disc">
          <PlayMark />
        </span>
        <span>{trailer.label}</span>
      </button>
      {player}
    </>
  )
}

/**
 * The trailer as a section of its own: a picture from the game framed like a
 * viewfinder, with one large play button. The whole picture is the button.
 */
export function TrailerSection({ trailer }: { trailer: Trailer }) {
  const { opener, player, play } = usePlayer(trailer)
  const { poster } = trailer

  return (
    <section className="section trailer" id="trailer" aria-labelledby="trailer-title" tabIndex={-1}>
      <div className="wrap">
        <div className="trailer__stage on-ink" style={{ background: poster.tone }}>
          {/* The words beside it say what this is, so the picture itself stays silent. */}
          <div className="trailer__poster">
            <Picture image={{ ...poster, alt: '' }} sizes={SIZES.wide} />
          </div>
          <div className="trailer__shade" aria-hidden="true" />
          <div className="trailer__marks" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="trailer__text">
            <p className="eyebrow">{trailer.eyebrow}</p>
            <h2 className="h-section" id="trailer-title">
              {trailer.heading}
            </h2>
            <p className="trailer__lede">{trailer.lede}</p>
          </div>
          <button ref={opener} className="trailer__play" type="button" onClick={play}>
            <span className="trailer__disc">
              <PlayMark />
            </span>
            <span className="trailer__label">{trailer.label}</span>
          </button>
        </div>
        <div className="trailer__foot">
          <p className="art__caption">
            {poster.caption}. {trailer.note}
          </p>
          <OnYouTube trailer={trailer} />
        </div>
      </div>
      {player}
    </section>
  )
}

/* ---------- Where to follow the game ---------- */

/** The game's own channels. Shows nothing at all until one is configured. */
export function Community() {
  const { community } = game
  if (community.channels.length === 0) return null

  return (
    <section className="section" id="community" aria-labelledby="community-title" tabIndex={-1}>
      <div className="wrap">
        <div className="section-head">
          <h2 className="h-section" id="community-title">
            {community.heading}
          </h2>
          <p className="lede">{community.lede}</p>
        </div>
        <ul className="channels">
          {community.channels.map((channel) => (
            <li key={channel.url}>
              <a
                className={`channel channel--${channel.icon}`}
                data-tilt=""
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="channel__icon">
                  <Icon name={channel.icon} />
                </span>
                <span className="channel__name">{channel.name}</span>
                <span className="channel__title">{channel.title}</span>
                <span className="channel__text">{channel.text}</span>
                <span className="channel__action">
                  <span>
                    {channel.action}
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </span>
                  <Icon name="external" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
