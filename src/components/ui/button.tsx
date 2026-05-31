'use client'
import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
        variant === 'default' && 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 active:scale-[0.98]',
        variant === 'secondary' && 'bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-white',
        variant === 'outline' && 'border border-[var(--border)] bg-transparent hover:bg-[var(--secondary)] text-[var(--foreground)]',
        variant === 'ghost' && 'bg-transparent hover:bg-[var(--secondary)] text-[var(--foreground)]',
        size === 'sm' && 'h-8 px-3 text-sm',
        size === 'md' && 'h-10 px-5 text-sm',
        size === 'lg' && 'h-12 px-8 text-base',
        className
      )}
      {...props}
    />
  )
)
Button.displayName = 'Button'
export { Button }
