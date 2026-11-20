import { cn } from '../../utils/cn'

const variants = {
  primary:
    'bg-gold text-background hover:bg-gold-soft border-gold',
  outline:
    'bg-transparent text-foreground border-line hover:border-gold hover:text-gold',
  ghost:
    'bg-transparent text-foreground border-transparent hover:text-gold',
}

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  className,
  type,
  children,
  ...props
}) {
  return (
    <Component
      type={Component === 'button' ? type ?? 'button' : type}
      className={cn(
        'inline-flex items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant] ?? variants.primary,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
