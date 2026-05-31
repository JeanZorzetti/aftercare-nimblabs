import { cn } from '@/lib/utils'

export function Section({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn('mx-auto max-w-5xl w-full px-6 py-16', className)}
      {...props}
    />
  )
}
