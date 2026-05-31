import { cn } from '@/lib/utils'

export function Badge({
  className,
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'secondary' | 'success' | 'destructive'
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-[var(--primary)] text-white',
        variant === 'secondary' && 'bg-[var(--secondary)] text-[var(--foreground)]',
        variant === 'success' && 'bg-emerald-50 text-emerald-700',
        variant === 'destructive' && 'bg-red-50 text-red-700',
        className
      )}
      {...props}
    />
  )
}
