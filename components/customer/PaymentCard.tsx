'use client'

import { motion } from 'framer-motion'
import { Receipt, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PaymentRow {
  label: string
  value: string
  isDiscount?: boolean
  isTotal?: boolean
}

interface PaymentCardProps {
  rows: PaymentRow[]
  paymentMethod?: string
  paymentStatus?: 'paid' | 'pending' | 'refunded'
  onDownloadReceipt?: () => void
  onPayNow?: () => void
}

export function PaymentCard({
  rows,
  paymentMethod,
  paymentStatus,
  onDownloadReceipt,
  onPayNow,
}: PaymentCardProps) {
  return (
    <motion.div
      className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
          Payment Details
        </h3>
        <Receipt className="h-4 w-4 text-neutral-400" />
      </div>

      {/* Rows */}
      <div className="space-y-2.5">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className={cn(
              'flex items-center justify-between',
              row.isTotal && 'border-t border-neutral-100 pt-3 mt-1',
            )}
          >
            <span
              className={cn(
                'text-sm',
                row.isTotal ? 'font-semibold text-neutral-800' : 'text-neutral-600',
              )}
            >
              {row.label}
            </span>
            <span
              className={cn(
                'text-sm font-semibold',
                row.isDiscount && 'text-green-600',
                row.isTotal && 'text-base text-neutral-900',
                !row.isDiscount && !row.isTotal && 'text-neutral-800',
              )}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Payment method */}
      {paymentMethod && (
        <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-xs text-neutral-500">Payment via</span>
          <span className="text-xs font-semibold text-neutral-700">{paymentMethod}</span>
        </div>
      )}

      {/* Status + actions */}
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        {paymentStatus === 'paid' && (
          <>
            <div className="flex-1 flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2">
              <span className="text-green-600 text-sm font-semibold">✅ Payment Received</span>
            </div>
            {onDownloadReceipt && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl h-9 text-xs"
                onClick={onDownloadReceipt}
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Receipt
              </Button>
            )}
          </>
        )}
        {paymentStatus === 'pending' && (
          <>
            <div className="flex-1 flex items-center gap-2 bg-amber-50 rounded-xl px-3 py-2">
              <span className="text-amber-700 text-sm font-semibold">⏳ Payment Pending</span>
            </div>
            {onPayNow && (
              <Button
                size="sm"
                className="rounded-xl h-9 text-xs bg-saffron hover:bg-saffron-dark text-white font-semibold"
                onClick={onPayNow}
              >
                Pay Now
              </Button>
            )}
          </>
        )}
        {paymentStatus === 'refunded' && (
          <div className="flex-1 flex items-center gap-2 bg-purple-50 rounded-xl px-3 py-2">
            <span className="text-purple-700 text-sm font-semibold">↩️ Refunded</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
