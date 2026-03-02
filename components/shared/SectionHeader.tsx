'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface SectionHeaderProps {
  heading: string
  subtext?: string
  align?: 'left' | 'center'
  className?: string
  animate?: boolean
  id?: string
}

export function SectionHeader({
  heading,
  subtext,
  align = 'left',
  className,
  animate = true,
  id,
}: SectionHeaderProps) {
  const Wrapper = animate ? motion.div : 'div'
  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.4, ease: 'easeOut' },
      }
    : {}

  return (
    // @ts-expect-error - motion.div and 'div' have compatible props
    <Wrapper
      className={cn(
        'mb-8',
        align === 'center' && 'text-center',
        className
      )}
      {...motionProps}
    >
      <h2 id={id} className="text-[36px] font-bold text-[#1E293B] leading-tight">
        {heading}
      </h2>
      {subtext && (
        <p className="mt-2 text-base text-[#64748B]">{subtext}</p>
      )}
    </Wrapper>
  )
}
