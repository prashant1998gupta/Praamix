import { Link } from 'react-router'
import { site } from '../content/site.ts'
import { Wordmark } from './Wordmark.tsx'

/* Read once when the site loads, so rendering stays predictable. */
const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="site-footer on-ink">
      <div className="wrap">
        <div className="site-footer__inner">
          <Link className="site-footer__home" to="/" aria-label={`${site.name}, home`}>
            <Wordmark />
          </Link>
          <nav className="site-footer__nav" aria-label="Footer">
            <ul className="site-footer__list">
              {site.nav.map((item) => (
                <li key={item.to}>
                  <Link className="site-footer__link" to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="site-footer__small site-footer__legal">
            © {YEAR} {site.name}
          </p>
          {site.footer.note && (
            <p className="site-footer__small site-footer__note">{site.footer.note}</p>
          )}
        </div>
      </div>
    </footer>
  )
}
