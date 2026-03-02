'use client'

import { useState } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { Gift, Star, Users, MapPin, Sparkles, Lock, ChevronRight } from 'lucide-react'
import { PointsCard } from '@/components/customer/PointsCard'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Reward {
  id: string
  title: string
  description: string
  points_required: number
  icon: string
  category: 'discount' | 'upgrade' | 'freebie'
}

const REWARDS: Reward[] = [
  { id: 'r1', title: '₹500 Off', description: 'On your next booking', points_required: 200, icon: '🎁', category: 'discount' },
  { id: 'r2', title: '₹1,000 Off', description: 'On bookings above ₹5,000', points_required: 350, icon: '💰', category: 'discount' },
  { id: 'r3', title: 'Free Upgrade', description: 'Upgrade to Innova Crysta', points_required: 300, icon: '⬆️', category: 'upgrade' },
  { id: 'r4', title: 'Priority Support', description: 'Get 24/7 dedicated support', points_required: 150, icon: '🎯', category: 'freebie' },
  { id: 'r5', title: '20% Off', description: 'On any group booking', points_required: 500, icon: '🎉', category: 'discount' },
]

const HOW_TO_EARN = [
  { icon: MapPin, label: 'Complete a trip', points: '+50 pts' },
  { icon: Star, label: 'Rate your trip', points: '+10 pts' },
  { icon: Users, label: 'Refer a friend', points: '+100 pts' },
  { icon: Gift, label: 'First booking', points: '+25 pts' },
]

export default function RewardsPage() {
  const [userPoints] = useState(150)
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  const shouldReduce = useReducedMotion()

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Rewards & Loyalty</h1>
        <p className="text-neutral-500 text-sm mt-0.5">Earn points and unlock exclusive rewards</p>
      </div>

      {/* Points Card */}
      <PointsCard points={userPoints} nextTierPoints={200} nextTierReward="₹500 Off" tier="Silver" />

      {/* Available Rewards */}
      <div>
        <h2 className="font-heading font-semibold text-neutral-700 text-sm mb-3">Available Rewards</h2>
        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {REWARDS.map((reward) => {
            const isUnlocked = userPoints >= reward.points_required
            const remaining = reward.points_required - userPoints

            return (
              <motion.button
                key={reward.id}
                variants={itemVariants}
                whileHover={shouldReduce ? {} : { scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => isUnlocked && setSelectedReward(reward)}
                className={cn(
                  'w-full text-left bg-white rounded-2xl border p-4 shadow-sm flex items-center gap-4 transition-colors',
                  isUnlocked
                    ? 'border-saffron/30 hover:border-saffron/60 cursor-pointer'
                    : 'border-neutral-100 opacity-70 cursor-default',
                )}
                aria-label={`${reward.title} – ${reward.description} – ${isUnlocked ? 'Redeem' : `${remaining} more points needed`}`}
              >
                <span className="text-3xl flex-shrink-0">{reward.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-heading font-bold text-neutral-800">{reward.title}</p>
                    {isUnlocked ? (
                      <span className="text-[10px] font-bold bg-saffron/10 text-saffron px-2 py-0.5 rounded-full">Unlocked</span>
                    ) : (
                      <span className="text-[10px] font-bold bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Lock className="h-2.5 w-2.5" /> Locked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">{reward.description}</p>
                  <p className="text-xs font-semibold text-royalBlue mt-1">
                    {reward.points_required} pts
                    {!isUnlocked && (
                      <span className="text-neutral-400 font-normal"> · {remaining} more needed</span>
                    )}
                  </p>
                </div>
                {isUnlocked && <ChevronRight className="h-4 w-4 text-neutral-400 flex-shrink-0" />}
              </motion.button>
            )
          })}
        </motion.div>
      </div>

      {/* How to Earn */}
      <div className="bg-gradient-to-br from-warmBeige to-warmBeige-light rounded-2xl p-5 border border-warmBeige-dark">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-goldAccent" />
          <h2 className="font-heading font-semibold text-neutral-700 text-sm">How to Earn Points</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {HOW_TO_EARN.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 bg-white rounded-xl p-3">
              <div className="w-8 h-8 rounded-lg bg-saffron/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="h-4 w-4 text-saffron" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 leading-tight">{item.label}</p>
                <p className="text-xs font-bold text-saffron">{item.points}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Refer & Earn */}
      <div className="bg-gradient-to-r from-saffron to-saffron-light rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <Users className="h-5 w-5 mb-2 text-white" />
            <p className="font-heading font-bold text-lg">Invite Friends</p>
            <p className="text-sm text-white/80 mt-0.5">Earn 100 pts per referral!</p>
          </div>
          <Button className="bg-white text-saffron hover:bg-white/90 font-semibold rounded-xl h-9 px-4 text-sm">
            Invite
          </Button>
        </div>
      </div>

      {/* Redeem Modal */}
      <AnimatePresence>
        {selectedReward && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReward(null)}
            />
            <motion.div
              className="fixed inset-x-4 bottom-4 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-sm bg-white rounded-2xl p-6 z-50 shadow-2xl"
              initial={{ opacity: 0, y: shouldReduce ? 0 : 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
            >
              <div className="text-center mb-5">
                <span className="text-5xl">{selectedReward.icon}</span>
                <h3 className="font-heading font-bold text-xl text-neutral-900 mt-2">{selectedReward.title}</h3>
                <p className="text-sm text-neutral-500 mt-1">{selectedReward.description}</p>
                <p className="text-xs font-semibold text-royalBlue mt-2">
                  Costs {selectedReward.points_required} points · You have {userPoints} pts
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setSelectedReward(null)}>
                  Cancel
                </Button>
                <Button
                  className="flex-1 rounded-xl bg-saffron hover:bg-saffron-dark text-white font-semibold"
                  onClick={() => {
                    // TODO: call API to redeem reward, e.g.:
                    // await fetch('/api/rewards/redeem', { method: 'POST', body: JSON.stringify({ rewardId: selectedReward.id }) })
                    alert(`Reward "${selectedReward.title}" redeemed! Check your email for the voucher code.`)
                    setSelectedReward(null)
                  }}
                >
                  Redeem Now
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
