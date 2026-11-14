import { Link, useLocation } from 'react-router'
import { site } from '../content/site.ts'
import { Wordmark } from './Wordmark.tsx'

/**
 * Four destinations, always visible. There is no menu to open, so nothing is
 * hidden behind a tap and there is no dialog to trap focus in.
 */
export function Header() {
  const { pathname } = useLocation()

  return (
    <header className="site-header">
      <div className="wrap">
        <div className="site-header__inner">
          <Link
            className="site-header__home"
            to="/"
            aria-label={`${site.name}, home`}
            aria-current={pathname === '/' ? 'page' : undefined}
          >
            <Wordmark />
          </Link>
          <nav className="site-nav" aria-label="Primary">
            <ul className="site-nav__list">
              {site.nav.map((item) => (
                <li key={item.to}>
                  <Link
                    className="site-nav__link"
                    to={item.to}
                    aria-current={
                      item.section && pathname.startsWith(item.section) ? 'true' : undefined
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
