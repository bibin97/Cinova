import { site } from '../../data/site'
import Logo from '../common/Logo'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Logo />
        <p className="text-sm text-muted">
          {site.tagline} Frontend foundation only. Streaming, payments, and accounts are not live yet.
        </p>
      </div>
    </footer>
  )
}
