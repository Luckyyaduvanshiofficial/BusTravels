'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon: string           // emoji or text icon e.g. '🔍'
  iconLabel?: string     // accessible label for the icon; defaults to heading if omitted
  heading: string
  subtext: string
  ctaLabel?: string
  onCta?: () => void
  secondaryCtaLabel?: string
  onSecondaryCta?: () => void
  className?: string
}

/**
 * Empty state component.
 * Spec: Icon 120×120, heading, subtext, CTA
 */
export function EmptyState({
  icon,
  iconLabel,
  heading,
  subtext,
  ctaLabel,
  onCta,
  secondaryCtaLabel,
  onSecondaryCta,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-20 px-6 text-center',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div
        className="text-7xl mb-6 select-none"
        role="img"
        aria-label={iconLabel ?? heading}
        style={{ fontSize: 80, lineHeight: 1 }}
      >
        {icon}
      </div>

      <h3 className="text-[24px] font-semibold text-[#1E293B] mb-2">{heading}</h3>
      <p className="text-base text-[#64748B] max-w-sm">{subtext}</p>

      {(ctaLabel ?? secondaryCtaLabel) && (
        <div className="flex gap-3 mt-8 flex-wrap justify-center">
          {ctaLabel && onCta && (
            <Button
              onClick={onCta}
              className="bg-[#F97316] hover:bg-[#EA580C] text-white px-6 h-12 rounded-lg font-medium text-base transition-all hover:-translate-y-0.5"
            >
              {ctaLabel}
            </Button>
          )}
          {secondaryCtaLabel && onSecondaryCta && (
            <Button
              variant="outline"
              onClick={onSecondaryCta}
              className="px-6 h-12 rounded-lg font-medium text-base border-slate-200 text-[#1E293B] hover:bg-slate-50"
            >
              {secondaryCtaLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
