import { useEffect } from 'react'
import type { RouteMeta } from '../content/routes.ts'

/**
 * Keeps the tab title, the search description and the "keep out of search
 * results" flag in step with the page being shown.
 */
export function useDocumentMeta(meta: RouteMeta) {
  useEffect(() => {
    document.title = meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)

    let robots = document.querySelector('meta[name="robots"]')
    if (!meta.noindex) {
      robots?.remove()
      return
    }
    if (!robots) {
      robots = document.createElement('meta')
      robots.setAttribute('name', 'robots')
      document.head.append(robots)
    }
    robots.setAttribute('content', 'noindex')
  }, [meta])
}
