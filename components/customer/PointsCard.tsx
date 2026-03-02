'use client'

import { motion, useReducedMotion, useMotionValue, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Gift, Sparkles } from 'lucide-react'

interface PointsCardProps {
  points: number
  nextTierPoints: number
  nextTierReward: string
  tier?: string
}

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionVal = useMotionValue(0)

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toString()
      },
    })
    return controls.stop
  }, [value, motionVal])

  return <span ref={ref}>0</span>
}

export function PointsCard({ points, nextTierPoints, nextTierReward, tier = 'Silver' }: PointsCardProps) {
  const shouldReduce = useReducedMotion()
  const progress = nextTierPoints > 0
    ? Math.min((points / nextTierPoints) * 100, 100)
    : 100

  return (
    <motion.div
      className="relative bg-gradient-to-br from-royalBlue to-deepPurple rounded-2xl overflow-hidden text-white p-6 shadow-lg"
      initial={{ opacity: 0, scale: shouldReduce ? 1 : 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-goldAccent" />
            <span className="text-sm font-semibold text-white/80">Loyalty Points</span>
          </div>
          <span className="text-xs bg-white/20 rounded-full px-2.5 py-0.5 font-semibold">
            {tier}
          </span>
        </div>

        {/* Points */}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-5xl font-extrabold font-heading">
            {shouldReduce ? points : <AnimatedNumber value={points} />}
          </span>
          <span className="text-lg text-white/70">pts</span>
        </div>

        {/* Progress bar */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-white/70 mb-1.5">
            <span>{points} pts</span>
            <span>{nextTierPoints} pts</span>
          </div>
          <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-goldAccent to-saffron rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' as const, delay: 0.3 }}
            />
          </div>
        </div>

        {/* Next reward */}
        <div className="flex items-center gap-1.5 mt-3">
          <Sparkles className="h-3.5 w-3.5 text-goldAccent" />
          {points >= nextTierPoints && nextTierPoints > 0 ? (
            <p className="text-xs text-white/80">
              You&apos;ve unlocked{' '}
              <span className="font-bold text-goldAccent">{nextTierReward}</span>!
            </p>
          ) : (
            <p className="text-xs text-white/80">
              Earn{' '}
              <span className="font-bold text-white">{Math.max(0, nextTierPoints - points)} more pts</span>{' '}
              to unlock{' '}
              <span className="font-bold text-goldAccent">{nextTierReward}</span>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
