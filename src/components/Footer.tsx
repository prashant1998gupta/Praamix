import { Link } from 'react-router'
import { legalNav, nav, site, social } from '../content/site.ts'
import { Logo } from './Logo.tsx'

/* Read once when the site loads, so rendering stays predictable. */
const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__top">
          <Link className="site-footer__home" to="/" aria-label={`${site.name} home`}>
            <Logo />
          </Link>
          <nav aria-label="Footer">
            <ul className="site-footer__nav">
              {nav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="site-footer__base">
          <p>
            © {YEAR} {site.name}
          </p>
          {social.length > 0 && (
            <ul className="site-footer__links">
              {social.map((link) => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.label}
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
          <ul className="site-footer__links">
            {legalNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
