'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BusForm } from '@/components/BusForm'

export default function NewBusPage() {
  const [verified, setVerified] = useState<boolean | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/operator/login')
        return
      }

      const role = user.user_metadata?.role
      if (role !== 'operator') {
        router.push('/')
        return
      }

      const isVerified = user.user_metadata?.is_verified || false
      setVerified(isVerified)

      if (!isVerified) {
        // Allow viewing but show message in form
      }
    }

    checkAuth()
  }, [supabase, router])

  if (verified === false) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="p-8 bg-destructive/5 border border-destructive/20 rounded-2xl shadow-sm text-center">
            <h2 className="text-2xl font-display font-bold text-destructive mb-3 tracking-tight">
              Account Verification Pending
            </h2>
            <p className="text-muted-foreground font-medium mb-6">
              Your operator account is currently pending verification. You cannot add new buses until an admin fully verifies your profile.
            </p>
            <button
              onClick={() => router.push('/operator/dashboard')}
              className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-2"
            >
              ← Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.push('/operator/dashboard')}
          className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6 inline-flex items-center gap-2"
        >
          ← Back to My Fleet
        </button>
        <BusForm />
      </div>
    </div>
  )
}
