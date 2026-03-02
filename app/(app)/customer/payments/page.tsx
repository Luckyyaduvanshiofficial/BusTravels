'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, Plus, CreditCard, Smartphone, Building2, CheckCircle2, Clock, XCircle, Download, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FilterTabs } from '@/components/customer/FilterTabs'
import type { Transaction, PaymentMethod } from '@/lib/customer-types'
import { cn } from '@/lib/utils'

// Mock data – replace with real Supabase queries
const DEMO_METHODS: PaymentMethod[] = [
  { id: '1', type: 'upi', label: 'Google Pay', masked_details: 'rajesh@oksbi', is_default: true },
  { id: '2', type: 'card', label: 'VISA Card', masked_details: '**** 1234 (Exp: 12/28)' },
]

const DEMO_TRANSACTIONS: Transaction[] = [
  { id: 't1', booking_id: 'b1', booking_number: 'BUS12345', amount: 9000, type: 'payment', status: 'success', method: 'Google Pay', created_at: '2026-03-01T12:00:00Z' },
  { id: 't2', booking_id: 'b2', booking_number: 'BUS12346', amount: 5000, type: 'payment', status: 'pending', created_at: '2026-03-02T09:00:00Z' },
  { id: 't3', booking_id: 'b3', booking_number: 'BUS12340', amount: 7500, type: 'payment', status: 'success', method: 'VISA Card', created_at: '2026-02-20T14:30:00Z' },
]

const PAYMENT_TABS = [
  { id: 'all', label: 'All' },
  { id: 'success', label: 'Paid' },
  { id: 'pending', label: 'Pending' },
]

const METHOD_ICONS: Record<string, React.ElementType> = {
  upi: Smartphone,
  card: CreditCard,
  netbanking: Building2,
  wallet: Wallet,
}

const TX_STATUS_CONFIG: Record<string, { icon: LucideIcon; color: string; label: string }> = {
  success: { icon: CheckCircle2, color: 'text-green-600', label: 'Paid' },
  pending: { icon: Clock, color: 'text-amber-600', label: 'Pending' },
  failed: { icon: XCircle, color: 'text-red-500', label: 'Failed' },
}

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [walletBalance] = useState(0)

  const filtered = DEMO_TRANSACTIONS.filter((tx) => {
    if (activeTab === 'all') return true
    return tx.status === activeTab
  })

  const tabsWithCounts = PAYMENT_TABS.map((t) => ({
    ...t,
    count: t.id === 'all' ? DEMO_TRANSACTIONS.length : DEMO_TRANSACTIONS.filter((tx) => tx.status === t.id).length,
  }))

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Payments</h1>
        <p className="text-neutral-500 text-sm mt-0.5">Manage your wallet and payment history</p>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-br from-deepPurple to-royalBlue rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="h-4 w-4 text-goldAccent" />
              <span className="text-sm font-semibold text-white/80">Wallet Balance</span>
            </div>
            <p className="font-heading font-extrabold text-4xl">
              ₹{walletBalance.toLocaleString('en-IN')}
            </p>
          </div>
          <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl h-9 px-4 text-sm font-semibold">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Money
          </Button>
        </div>
      </div>

      {/* Saved Payment Methods */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-neutral-700 text-sm">Saved Methods</h2>
          <button className="text-xs font-semibold text-saffron hover:text-saffron-dark">+ Add</button>
        </div>
        <div className="space-y-3">
          {DEMO_METHODS.map((method) => {
            const Icon = METHOD_ICONS[method.type] ?? CreditCard
            return (
              <div key={method.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-white border border-neutral-200 flex items-center justify-center">
                  <Icon className="h-[18px] w-[18px] text-neutral-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-neutral-800">{method.label}</p>
                  <p className="text-xs text-neutral-500">{method.masked_details}</p>
                </div>
                {method.is_default && (
                  <span className="text-[10px] font-bold bg-saffron/10 text-saffron px-2 py-0.5 rounded-full">Default</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="font-heading font-semibold text-neutral-700 text-sm mb-3">Transaction History</h2>
        <FilterTabs tabs={tabsWithCounts} activeTab={activeTab} onChange={setActiveTab} className="mb-4" />

        <div className="space-y-3">
          {filtered.map((tx) => {
            const cfg = TX_STATUS_CONFIG[tx.status]
            const StatusIcon = cfg.icon
            let statusBg = 'bg-red-50'
            if (tx.status === 'success') statusBg = 'bg-green-50'
            else if (tx.status === 'pending') statusBg = 'bg-amber-50'
            let typeLabel = 'Wallet'
            if (tx.type === 'payment') typeLabel = 'Payment'
            else if (tx.type === 'refund') typeLabel = 'Refund'
            return (
              <div key={tx.id} className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', statusBg)}>
                  <StatusIcon className={cn('h-5 w-5', cfg.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-800">
                    {typeLabel}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {tx.booking_number ? `Booking #${tx.booking_number}` : ''}
                    {tx.method ? ` · ${tx.method}` : ''}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {new Date(tx.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={cn('font-heading font-bold text-sm',
                    tx.type === 'refund' ? 'text-green-600' : 'text-neutral-800'
                  )}>
                    {tx.type === 'refund' ? '+' : ''}₹{tx.amount.toLocaleString('en-IN')}
                  </p>
                  <p className={cn('text-[10px] font-semibold', cfg.color)}>{cfg.label}</p>
                </div>
                {tx.status === 'success' && (
                  <button
                    aria-label="Download receipt"
                    className="ml-2 w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
                  >
                    <Download className="h-3.5 w-3.5 text-neutral-500" />
                  </button>
                )}
                {tx.status === 'pending' && (
                  <Button size="sm" className="ml-2 h-8 px-3 text-xs rounded-xl bg-saffron hover:bg-saffron-dark text-white font-semibold">
                    Pay Now
                  </Button>
                )}
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-neutral-200 p-10 text-center">
            <Wallet className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
            <p className="text-sm text-neutral-400">No transactions found</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
