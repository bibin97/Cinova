import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { getFoundationStatus } from '../services/mockApi'
import { site } from '../data/site'

export default function HomePage() {
  useDocumentTitle('Home')
  const [status, setStatus] = useState(null)

  useEffect(() => {
    let cancelled = false

    getFoundationStatus().then((result) => {
      if (!cancelled) setStatus(result)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="space-y-4"
      >
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-gold">Phase 1 foundation</p>
        <h1 className="font-display text-4xl font-semibold sm:text-6xl">{site.name}</h1>
        <p className="text-xl text-muted">{site.tagline}</p>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          This screen confirms the customer app shell: theme tokens, layout, routing, Redux, and mock services.
          Catalog UI, search, and auth screens start in Phase 2 after your approval.
        </p>
      </motion.div>

      <div className="rounded-2xl border border-line bg-surface p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gold">Service layer</h2>
        {status ? (
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">Data source</dt>
              <dd>{status.source}</dd>
            </div>
            <div>
              <dt className="text-muted">Backend connected</dt>
              <dd>{status.backendConnected ? 'Yes' : 'No'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted">Status</dt>
              <dd>{status.message}</dd>
            </div>
          </dl>
        ) : (
          <p className="mt-4 text-sm text-muted">Checking mock service…</p>
        )}
      </div>
    </section>
  )
}
