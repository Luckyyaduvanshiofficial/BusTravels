'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Phone, Mail, MapPin, Bell, Shield, Download, Trash2, Pencil, Check, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ProfileSkeleton } from '@/components/customer/Skeletons'
import { cn } from '@/lib/utils'

interface ProfileData {
  full_name: string
  phone: string
  email: string
  city: string
  date_of_birth: string
  notifications_sms: boolean
  notifications_email: boolean
  notifications_push: boolean
  default_passengers: number
  member_since: string
}

const defaultProfile: ProfileData = {
  full_name: '',
  phone: '',
  email: '',
  city: '',
  date_of_birth: '',
  notifications_sms: true,
  notifications_email: true,
  notifications_push: false,
  default_passengers: 4,
  member_since: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
}

function FieldRow({
  icon: Icon,
  label,
  value,
  onSave,
  type = 'text',
}: {
  icon: React.ElementType
  label: string
  value: string
  onSave: (v: string) => void
  type?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  // Sync draft when the parent value changes and the field is not being edited
  useEffect(() => {
    if (!editing) setDraft(value)
  }, [value, editing])

  return (
    <div className="flex items-center gap-3 py-3 border-b border-neutral-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-neutral-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-neutral-500 mb-0.5">{label}</p>
        {editing ? (
          <input
            type={type}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full text-sm font-semibold text-neutral-800 border-b-2 border-saffron outline-none bg-transparent pb-0.5"
            autoFocus
            aria-label={label}
          />
        ) : (
          <p className="text-sm font-semibold text-neutral-800 truncate">{value || '—'}</p>
        )}
      </div>
      {editing ? (
        <div className="flex gap-1.5">
          <button
            onClick={() => { onSave(draft); setEditing(false) }}
            className="w-7 h-7 rounded-lg bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors"
            aria-label="Save"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => { setDraft(value); setEditing(false) }}
            className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-500 flex items-center justify-center hover:bg-neutral-200 transition-colors"
            aria-label="Cancel"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-400 flex items-center justify-center hover:bg-saffron/10 hover:text-saffron transition-colors"
          aria-label={`Edit ${label}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-neutral-700">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-10 h-6 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron',
          checked ? 'bg-saffron' : 'bg-neutral-200',
        )}
      >
        <span
          className={cn(
            'absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform',
            checked && 'translate-x-4',
          )}
        />
      </button>
    </div>
  )
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      try {
        setProfile({
          ...defaultProfile,
          full_name: user.user_metadata?.full_name ?? '',
          phone: user.user_metadata?.phone ?? user.phone ?? '',
          email: user.email ?? '',
          member_since: new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
        })
      } catch (err) {
        console.error('Failed to load profile:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  function update<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setProfile((p) => ({ ...p, [key]: value }))
    // TODO: persist change to backend, e.g.:
    // await supabase.from('profiles').update({ [key]: value }).eq('id', userId)
  }

  if (loading) return <ProfileSkeleton />

  const initials = profile.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <motion.div
      className="space-y-6 max-w-xl"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Profile Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-neutral-900">My Profile</h1>
        <p className="text-neutral-500 text-sm mt-0.5">Manage your personal information</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-saffron to-deepPurple flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-2xl font-bold text-white font-heading">{initials || 'U'}</span>
        </div>
        <div>
          <p className="font-heading font-bold text-lg text-neutral-800">
            {profile.full_name || 'Your Name'}
          </p>
          <p className="text-sm text-neutral-500">{profile.phone}</p>
          <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Member since {profile.member_since}
          </p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
        <h2 className="font-heading font-semibold text-neutral-700 text-sm mb-3">Personal Information</h2>
        <FieldRow icon={User} label="Full Name" value={profile.full_name} onSave={(v) => update('full_name', v)} />
        <FieldRow icon={Phone} label="Phone" value={profile.phone} onSave={(v) => update('phone', v)} type="tel" />
        <FieldRow icon={Mail} label="Email" value={profile.email} onSave={(v) => update('email', v)} type="email" />
        <FieldRow icon={MapPin} label="City" value={profile.city} onSave={(v) => update('city', v)} />
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-4 w-4 text-neutral-400" />
          <h2 className="font-heading font-semibold text-neutral-700 text-sm">Notifications</h2>
        </div>
        <Toggle label="SMS Notifications" checked={profile.notifications_sms} onChange={(v) => update('notifications_sms', v)} />
        <Toggle label="Email Notifications" checked={profile.notifications_email} onChange={(v) => update('notifications_email', v)} />
        <Toggle label="Push Notifications" checked={profile.notifications_push} onChange={(v) => update('notifications_push', v)} />
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4 text-neutral-400" />
          <h2 className="font-heading font-semibold text-neutral-700 text-sm">Security</h2>
        </div>
        <div className="space-y-2">
          {[
            { label: 'Change Password', href: '/auth/update-password' },
            { label: 'Two-Factor Authentication', href: '#' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              <span className="text-sm font-semibold text-neutral-700">{item.label}</span>
              <span className="text-neutral-400 text-xs">›</span>
            </a>
          ))}
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
        <h2 className="font-heading font-semibold text-neutral-700 text-sm mb-4">Account Actions</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-xl h-10 text-sm font-semibold"
            onClick={() => {
              // TODO: call API to export user data
              alert('Data export requested. You will receive an email shortly.')
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Download My Data
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-xl h-10 text-sm font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
            onClick={() => {
              // TODO: call API to delete account after confirmation
              if (window.confirm('Are you sure? This action cannot be undone.')) {
                alert('Account deletion requested. Our team will process it within 7 days.')
              }
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
