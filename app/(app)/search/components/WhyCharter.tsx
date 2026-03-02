'use client'

import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { staggerContainer, cardSlideUp } from '@/lib/animations'

const WHY_ITEMS = [
  {
    icon: '✅',
    title: 'Verified Operators',
    desc: 'All bus operators are thoroughly verified with valid licenses and documentation.',
  },
  {
    icon: '🛡️',
    title: 'Safe & Secure',
    desc: 'Licensed drivers with insurance coverage for every trip you take.',
  },
  {
    icon: '💰',
    title: 'Best Prices',
    desc: 'Compare prices instantly across multiple operators. No hidden charges.',
  },
  {
    icon: '📱',
    title: '24/7 Support',
    desc: 'Round-the-clock customer support via chat, call, and email.',
  },
  {
    icon: '🎯',
    title: 'Easy Booking',
    desc: 'Book in under 3 minutes with instant confirmation.',
  },
  {
    icon: '🔄',
    title: 'Easy Cancellation',
    desc: 'Hassle-free cancellation with transparent refund policies.',
  },
]

/**
 * Why Choose Charter section.
 * Spec: White bg, 80px vertical padding, 3-column feature grid
 */
export function WhyCharter() {
  return (
    <section
      className="py-20 bg-white"
      aria-labelledby="why-charter-heading"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          heading="Why choose Charter?"
          subtext="Trusted by thousands of travellers across India"
          align="center"
          id="why-charter-heading"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {WHY_ITEMS.map((item) => (
            <motion.div
              key={item.title}
              variants={cardSlideUp}
              className="flex gap-4 p-6 rounded-xl border border-[#E2E8F0] hover:shadow-md transition-shadow"
            >
              <div
                className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl"
                aria-hidden="true"
              >
                {item.icon}
              </div>
              <div>
                <h3 className="text-[18px] font-semibold text-[#1E293B] mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
