import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import { Link, useLocation } from 'react-router'
import { headerAction, nav, site } from '../content/site.ts'
import { Action } from './Action.tsx'
import { Logo } from './Logo.tsx'

/**
 * Logo, four destinations and one button. On wide screens they sit in a row.
 * On narrow screens a Menu button opens them as a list below the bar. The list
 * is part of the page, not a pop-up, so Tab moves through it in order and
 * Escape closes it.
 */
export function Header() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const button = useRef<HTMLButtonElement>(null)
  const action = headerAction()
  /* The bar slides away while the visitor scrolls down, and comes back as soon as they scroll up. */
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const now = window.scrollY
      if (Math.abs(now - last) < 8) return
      setHidden(now > last && now > 240)
      last = now
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !open) return
    setOpen(false)
    button.current?.focus()
  }

  const onNavClick = (event: MouseEvent) => {
    if (event.target instanceof Element && event.target.closest('a')) setOpen(false)
  }

  return (
    <header
      className="site-header"
      onKeyDown={onKeyDown}
      onFocus={() => setHidden(false)}
      data-hidden={hidden && !open ? '' : undefined}
    >
      <div className="wrap site-header__bar">
        <Link
          className="site-header__home"
          to="/"
          aria-label={`${site.name} home`}
          onClick={() => setOpen(false)}
        >
          <Logo live />
        </Link>
        <button
          ref={button}
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="visually-hidden">Menu</span>
          <span className="menu-button__bars" aria-hidden="true" />
        </button>
        <nav
          className="site-nav"
          id="site-menu"
          aria-label="Primary"
          data-open={open ? '' : undefined}
          onClick={onNavClick}
        >
          <ul className="site-nav__list">
            {nav.map((item) => (
              <li key={item.to}>
                <Link
                  className="site-nav__link"
                  to={item.to}
                  aria-current={pathname.startsWith(item.match) ? 'page' : undefined}
                  viewTransition
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Action className="site-nav__cta" to={action.to}>
            {action.label}
          </Action>
        </nav>
      </div>
    </header>
  )
}
