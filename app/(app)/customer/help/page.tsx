'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Phone, Mail, ChevronDown, ChevronUp, Send, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const FAQS = [
  {
    q: 'How do I cancel my booking?',
    a: 'Go to My Bookings, open the booking, and click "Cancel Booking". Cancellations made 48+ hours before the trip receive a full refund.',
  },
  {
    q: 'When is the driver\'s contact revealed?',
    a: 'The driver\'s phone number is revealed 2 hours before your trip start time. This ensures privacy until the trip is imminent.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept UPI (Google Pay, PhonePe, Paytm), credit/debit cards, net banking, and cash (subject to driver approval).',
  },
  {
    q: 'Can I reschedule my booking?',
    a: 'Currently, rescheduling is done via WhatsApp with the driver after confirmation. Contact our support team for assistance.',
  },
  {
    q: 'How do I earn loyalty points?',
    a: 'Earn 50 pts per completed trip, 10 pts for rating your trip, 100 pts per referral, and 25 pts on your first booking.',
  },
  {
    q: 'Is my personal data safe?',
    a: 'Yes. We use bank-grade encryption and never share your contact details with third parties. Driver contact is hidden until 2 hours before your trip.',
  },
]

function FAQItem({ q, a }: Readonly<{ q: string; a: string }>) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-neutral-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-center justify-between gap-3 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron rounded-lg"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-neutral-800 pr-4">{q}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-saffron flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-neutral-400 flex-shrink-0" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-neutral-600 pb-4 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function HelpPage() {
  const [formData, setFormData] = useState({ subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) clearTimeout(resetTimerRef.current)
    }
  }, [])

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setSubmitting(true)
    try {
      // TODO: replace with real API call, e.g.:
      // await fetch('/api/support', { method: 'POST', body: JSON.stringify(formData) })
      await new Promise((r) => setTimeout(r, 600))
      setSubmitted(true)
      setFormData({ subject: '', message: '' })
      resetTimerRef.current = setTimeout(() => setSubmitted(false), 3000)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      className="space-y-6 max-w-2xl"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Help & Support</h1>
        <p className="text-neutral-500 text-sm mt-0.5">We&apos;re here to help you 24/7</p>
      </div>

      {/* Quick Contact */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          {
            icon: MessageCircle,
            label: 'WhatsApp',
            sub: '+91-9876543210',
            href: 'https://wa.me/919876543210?text=Hi%20BusBook%20Support',
            color: 'bg-green-50 text-green-700',
            btnColor: 'bg-green-500 hover:bg-green-600',
          },
          {
            icon: Phone,
            label: 'Call Us',
            sub: '+91-9876543210',
            href: 'tel:+919876543210',
            color: 'bg-royalBlue/5 text-royalBlue',
            btnColor: 'bg-royalBlue hover:bg-royalBlue-dark',
          },
          {
            icon: Mail,
            label: 'Email',
            sub: 'support@busbook.in',
            href: 'mailto:support@busbook.in',
            color: 'bg-amber-50 text-amber-700',
            btnColor: 'bg-amber-500 hover:bg-amber-600',
          },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}>
              <item.icon className="h-6 w-6" />
            </div>
            <p className="font-heading font-semibold text-neutral-800 text-sm">{item.label}</p>
            <p className="text-xs text-neutral-500">{item.sub}</p>
          </a>
        ))}
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="h-4 w-4 text-saffron" />
          <h2 className="font-heading font-semibold text-neutral-700 text-sm">Frequently Asked Questions</h2>
        </div>
        <div>
          {FAQS.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
        <h2 className="font-heading font-semibold text-neutral-700 text-sm mb-4">Submit a Request</h2>
        {submitted ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <Send className="h-5 w-5 text-green-600" />
            </div>
            <p className="font-semibold text-neutral-700">Request submitted!</p>
            <p className="text-sm text-neutral-500 mt-1">We&apos;ll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Support request form">
            <div>
              <label htmlFor="subject" className="block text-xs font-semibold text-neutral-600 mb-1.5">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
                placeholder="What's the issue about?"
                className="w-full h-11 px-4 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs font-semibold text-neutral-600 mb-1.5">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                placeholder="Describe your issue in detail…"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron resize-none"
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full h-11 rounded-xl bg-saffron hover:bg-saffron-dark text-white font-semibold">
              <Send className="h-4 w-4 mr-2" />
              {submitting ? 'Sending…' : 'Send Message'}
            </Button>
          </form>
        )}
      </div>
    </motion.div>
  )
}
