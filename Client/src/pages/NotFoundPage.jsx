import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import Button from '../components/common/Button'

export default function NotFoundPage() {
  useDocumentTitle('Not found')

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.24em] text-gold">404</p>
      <h1 className="mt-3 font-display text-4xl">This title is not on CINOVA</h1>
      <p className="mt-4 text-muted">The page you requested does not exist in the customer app yet.</p>
      <Button as={Link} to="/" className="mt-8">
        Back to Home
      </Button>
    </section>
  )
}
