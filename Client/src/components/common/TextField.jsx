import { cn } from '../../utils/cn'

export default function TextField({ id, label, className, ...props }) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm text-muted" htmlFor={id}>
      {label ? <span>{label}</span> : null}
      <input
        id={id}
        className={cn(
          'h-11 rounded-lg border border-line bg-surface px-3 text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-gold',
          className,
        )}
        {...props}
      />
    </label>
  )
}
