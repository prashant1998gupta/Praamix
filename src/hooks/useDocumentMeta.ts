import { useEffect } from 'react'

/** Keeps the tab title and search description in step with the current page. */
export function useDocumentMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
