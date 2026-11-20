import { useEffect } from 'react'
import { site } from '../data/site'

export function useDocumentTitle(pageTitle) {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} — ${site.name}` : `${site.name} — ${site.tagline}`
  }, [pageTitle])
}
