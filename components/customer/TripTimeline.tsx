'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, Circle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TimelineStep {
  id: string
  label: string
  description?: string
  timestamp?: string
  status: 'completed' | 'current' | 'upcoming'
}

interface TripTimelineProps {
  steps: TimelineStep[]
}

export function TripTimeline({ steps }: TripTimelineProps) {
  const shouldReduce = useReducedMotion()

  return (
    <div className="relative" role="list" aria-label="Booking status timeline">
      {steps.map((step, idx) => (
        <motion.div
          key={step.id}
          role="listitem"
          className="relative flex gap-4 pb-6 last:pb-0"
          initial={{ opacity: 0, x: shouldReduce ? 0 : -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
        >
          {/* Line */}
          {idx < steps.length - 1 && (
            <div
              className={cn(
                'absolute left-[17px] top-8 bottom-0 w-0.5',
                step.status === 'completed' ? 'bg-saffron/60' : 'bg-neutral-200',
              )}
            />
          )}

          {/* Icon */}
          <div className="relative flex-shrink-0 mt-0.5">
            {step.status === 'completed' && (
              <motion.div
                initial={{ scale: shouldReduce ? 1 : 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: idx * 0.12 }}
              >
                <CheckCircle2 className="h-9 w-9 text-saffron fill-saffron/10" />
              </motion.div>
            )}
            {step.status === 'current' && (
              <motion.div
                animate={shouldReduce ? {} : { scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
              >
                <Clock className="h-9 w-9 text-royalBlue fill-royalBlue/10" />
              </motion.div>
            )}
            {step.status === 'upcoming' && (
              <Circle className="h-9 w-9 text-neutral-300" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pt-1">
            <p
              className={cn(
                'font-semibold text-sm',
                step.status === 'completed' && 'text-neutral-800',
                step.status === 'current' && 'text-royalBlue',
                step.status === 'upcoming' && 'text-neutral-400',
              )}
            >
              {step.label}
            </p>
            {step.description && (
              <p className="text-xs text-neutral-500 mt-0.5">{step.description}</p>
            )}
            {step.timestamp && (
              <p
                className={cn(
                  'text-xs mt-0.5',
                  step.status === 'completed' ? 'text-neutral-400' : 'text-neutral-300',
                )}
              >
                {step.timestamp}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
