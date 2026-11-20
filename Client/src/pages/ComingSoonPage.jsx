import { useLocation } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function ComingSoonPage({ title }) {
  const location = useLocation()
  useDocumentTitle(title ?? 'Coming soon')

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.24em] text-gold">Phase 2</p>
      <h1 className="mt-3 font-display text-4xl">{title ?? 'Coming soon'}</h1>
      <p className="mt-4 max-w-xl text-muted">
        Route <span className="text-foreground">{location.pathname}</span> is registered so navigation works.
        Full UI for this screen will be built in Phase 2.
      </p>
    </section>
  )
}
