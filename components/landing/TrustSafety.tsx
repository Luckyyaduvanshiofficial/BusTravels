'use client'

import { useEffect, useRef, useState } from 'react'
import { ShieldCheck, FileText, Phone, Star } from 'lucide-react'

const TRUST_BADGES = [
  {
    icon: ShieldCheck,
    title: 'Verified Drivers',
    titleHindi: 'सत्यापित चालक',
    description: 'Government ID, license & background check completed for every driver on the platform.',
  },
  {
    icon: FileText,
    title: 'Insured Vehicles',
    titleHindi: 'बीमित वाहन',
    description: 'Every vehicle has valid commercial insurance and fitness certificate before listing.',
  },
  {
    icon: Phone,
    title: '24/7 Support',
    titleHindi: '24/7 सहायता',
    description: 'Call or WhatsApp us anytime. Our local Jaipur team responds within minutes.',
  },
  {
    icon: Star,
    title: 'Real Reviews',
    titleHindi: 'असली समीक्षाएं',
    description: 'Only verified customers who traveled can leave reviews. No fake ratings.',
  },
]

const STATS = [
  { value: 1000, suffix: '+', label: 'Happy Customers', labelHindi: 'खुश ग्राहक' },
  { value: 95,   suffix: '%', label: 'Trips Completed',  labelHindi: 'यात्राएं पूरी' },
  { value: 50,   suffix: '+', label: 'Verified Drivers', labelHindi: 'सत्यापित चालक' },
  { value: 4.5,  suffix: '★', label: 'Average Rating',   labelHindi: 'औसत रेटिंग' },
]

function useCountUp(target: number, decimals = 0, triggered: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!triggered) return
    const duration = 1800
    const steps = 60
    const increment = target / steps
    let current = 0
    const interval = setInterval(() => {
      current = Math.min(current + increment, target)
      setValue(parseFloat(current.toFixed(decimals)))
      if (current >= target) clearInterval(interval)
    }, duration / steps)
    return () => clearInterval(interval)
  }, [triggered, target, decimals])
  return value
}

function StatCard({
  stat,
  triggered,
}: {
  stat: (typeof STATS)[0]
  triggered: boolean
}) {
  const decimals = stat.value % 1 !== 0 ? 1 : 0
  const count = useCountUp(stat.value, decimals, triggered)
  return (
    <div className="text-center space-y-1">
      <p className="font-heading text-4xl sm:text-5xl font-bold text-white tabular-nums">
        {count.toFixed(decimals)}
        <span className="text-goldAccent">{stat.suffix}</span>
      </p>
      <p className="text-white/80 font-medium text-base">{stat.label}</p>
      <p className="font-hindi text-white/55 text-sm">{stat.labelHindi}</p>
    </div>
  )
}

export function TrustSafety() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true)
            e.target.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'))
          }
        })
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="trust-safety"
      ref={sectionRef}
      className="py-20 sm:py-28 bg-royalBlue"
      aria-labelledby="trust-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-14 reveal">
          <span className="inline-block px-4 py-1.5 bg-white/15 text-white/90 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
            Safety First
          </span>
          <h2 id="trust-heading" className="font-heading text-3xl sm:text-4xl font-bold text-white mb-2">
            Your Safety, Our Priority
          </h2>
          <p className="font-hindi text-xl text-white/60">आपकी सुरक्षा, हमारी जिम्मेदारी</p>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {TRUST_BADGES.map((badge, i) => {
            const Icon = badge.icon
            return (
              <div
                key={badge.title}
                className={`reveal reveal-delay-${i + 1} flex flex-col items-center text-center p-6 rounded-2xl bg-white/8 hover:bg-white/12 transition-colors`}
              >
                <div className="w-14 h-14 rounded-2xl bg-goldAccent/20 flex items-center justify-center mb-4" aria-hidden>
                  <Icon className="w-7 h-7 text-goldAccent" />
                </div>
                <h3 className="font-heading font-bold text-white mb-1">{badge.title}</h3>
                <p className="font-hindi text-sm text-white/50 mb-2">{badge.titleHindi}</p>
                <p className="text-white/70 text-sm leading-relaxed">{badge.description}</p>
              </div>
            )
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-white/15 mb-14" />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} triggered={visible} />
          ))}
        </div>
      </div>
    </section>
  )
}
