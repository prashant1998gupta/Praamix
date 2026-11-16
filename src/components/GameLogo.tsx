import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { sheriffTownVr } from '../content/game.ts'
import { SIZES } from '../content/images.ts'
import { onLeanConnection } from '../hooks/loading.ts'
import { Picture } from './Picture.tsx'

const game = sheriffTownVr

/*
 * Where the revolver drum sits in the logo, as shares of the logo's width and
 * height. scripts/stage-game-brand.mjs cuts the drum out at this place; here
 * it is laid back over the logo, exactly where it came from, so it can turn.
 */
const DRUM = {
  left: `${((435 - 137) / 1200) * 100}%`,
  top: `${((536 - 137) / 900) * 100}%`,
  width: `${(274 / 1200) * 100}%`,
}

/** The logo's own reveal animation: bullets load into the drum and it spins. */
const REVEAL = '/media/stv-logo-reveal.webm'
/* If the animation has not started by now, the still logo arrives instead. */
const REVEAL_WAIT = 2500

/*
 * The reveal is a video with a see-through background. Safari and every
 * iPhone browser cannot show one, so they get the still logo, which arrives
 * with a small animation of its own. So do phones, slow or metered
 * connections, and anyone who asked for reduced motion.
 */
function canPlayReveal(): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (!window.matchMedia('(min-width: 56em)').matches) return false
  if (onLeanConnection()) return false
  const agent = navigator.userAgent
  const iOS = /iPhone|iPad|iPod/.test(agent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const safari = /Safari/.test(agent) && !/Chrome|Chromium|Edg|OPR|Firefox/.test(agent)
  if (iOS || safari) return false
  return document.createElement('video').canPlayType('video/webm; codecs="vp9"') !== ''
}

type Props = {
  /** Plays the reveal as the logo arrives. For the opening of a page. */
  reveal?: boolean
  /** True at the top of a page, so the logo loads first. */
  priority?: boolean
  /** Each time this number goes up, the drum spins once. */
  spin?: number
}

/**
 * The Sheriff Town VR logo, with a drum that turns.
 *
 * It is decorative here: wherever it is used, the game's name is given in
 * text beside it for screen readers and search engines.
 */
export function GameLogo({ reveal = false, priority = false, spin = 0 }: Props) {
  /* 'film': the reveal is loading or playing. 'still': the finished logo. */
  const [stage, setStage] = useState<'film' | 'still'>(() => (reveal && canPlayReveal() ? 'film' : 'still'))
  /* Whether the film was ever going to play. If so, the still logo simply takes over from it. */
  const [filmed] = useState(stage === 'film')
  const [rolling, setRolling] = useState(false)

  useEffect(() => {
    if (stage !== 'film' || rolling) return
    const timer = window.setTimeout(() => setStage('still'), REVEAL_WAIT)
    return () => window.clearTimeout(timer)
  }, [stage, rolling])

  const filming = stage === 'film'

  return (
    <span
      className="game-logo"
      data-arrive={reveal && !filmed ? '' : undefined}
      data-filming={filming ? '' : undefined}
      aria-hidden="true"
    >
      <span className="game-logo__still">
        <Picture image={{ ...game.logo, alt: '' }} sizes={SIZES.logo} priority={priority} />
        <span className="game-logo__drum" style={{ ...DRUM, '--spin': spin } as CSSProperties}>
          <Picture image={game.drum} sizes="(min-width: 56em) 6vw, 15vw" priority={priority} />
        </span>
      </span>
      {filming && (
        <video
          className="game-logo__film"
          src={REVEAL}
          width={800}
          height={600}
          muted
          autoPlay
          playsInline
          preload="auto"
          onPlaying={() => setRolling(true)}
          onEnded={() => setStage('still')}
          onError={() => setStage('still')}
        />
      )}
    </span>
  )
}
