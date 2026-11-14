import { Link } from 'react-router'
import { Arrow } from '../components/Arrow.tsx'
import { site } from '../content/site.ts'
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts'

export function NotFound() {
  useDocumentMeta(`Page not found · ${site.name}`, site.description)

  return (
    <main id="main" className="notfound" tabIndex={-1}>
      <div className="wrap">
        <div className="notfound__inner">
          <p className="kicker">404</p>
          <h1 className="notfound__title">{site.notFound.title}</h1>
          <Link className="action" to="/">
            <Arrow back />
            <span>{site.notFound.actionLabel}</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
