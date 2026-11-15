import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Arrow } from './Arrow.tsx'
import { Icon } from './Icon.tsx'

/**
 * solid    dark button, the main action on a light page
 * outline  white button with a dark edge, the second action
 * accent   orange button with dark text, used for starting a project
 * light    white button for dark bands
 */
type Variant = 'solid' | 'outline' | 'accent' | 'light'

type ActionProps = {
  to: string
  children: ReactNode
  variant?: Variant
  /** Points the arrow backwards and puts it first. */
  back?: boolean
  /** Fills the width on phones, with the arrow at the far edge. */
  wide?: boolean
  className?: string
}

const classes = (variant: Variant, wide = false, extra?: string) =>
  ['btn', `btn--${variant}`, wide && 'btn--wide', extra].filter(Boolean).join(' ')

/** A button that goes to another page of this site. */
export function Action({ to, children, variant = 'solid', back = false, wide = false, className }: ActionProps) {
  return (
    <Link className={classes(variant, wide, className)} to={to}>
      {back && <Arrow back />}
      <span>{children}</span>
      {!back && <Arrow />}
    </Link>
  )
}

type ExternalProps = { href: string; children: ReactNode; variant?: Variant | 'text' }

/** A link to another website. It opens in a new tab and says so to screen readers. */
export function ExternalAction({ href, children, variant = 'solid' }: ExternalProps) {
  return (
    <a
      className={variant === 'text' ? 'link-arrow' : classes(variant)}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span>
        {children}
        <span className="visually-hidden"> (opens in a new tab)</span>
      </span>
      <Icon name="external" />
    </a>
  )
}

/** An in-text link with an arrow, for the quieter next step. */
export function TextLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link className="link-arrow" to={to}>
      <span>{children}</span>
      <Arrow />
    </Link>
  )
}
