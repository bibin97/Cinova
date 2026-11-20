import { Clapperboard } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../../data/site'
import { cn } from '../../utils/cn'

/**
 * Temporary wordmark. Replace `mark` with a final SVG/PNG when the brand asset is ready.
 */
export default function Logo({ to = '/', className, showWordmark = true }) {
  return (
    <Link
      to={to}
      className={cn('inline-flex items-center gap-2 text-foreground', className)}
      aria-label={`${site.name} home`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/40 bg-surface">
        <Clapperboard className="h-4 w-4 text-gold" aria-hidden="true" />
      </span>
      {showWordmark ? (
        <span className="font-display text-xl font-semibold tracking-[0.18em]">{site.name}</span>
      ) : null}
    </Link>
  )
}
