'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Bell, Eye, Shield, Info, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

function SettingSection({ icon: Icon, title, children }: Readonly<{ icon: React.ElementType; title: string; children: React.ReactNode }>) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-4 w-4 text-neutral-400" />
        <h2 className="font-heading font-semibold text-neutral-700 text-sm">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function SettingRow({
  label,
  description,
  children,
}: Readonly<{
  label: string
  description?: string
  children: React.ReactNode
}>) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-50 last:border-0">
      <div className="min-w-0 flex-1 mr-4">
        <p className="text-sm font-semibold text-neutral-800">{label}</p>
        {description && <p className="text-xs text-neutral-500 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange, label }: Readonly<{ checked: boolean; onChange: (v: boolean) => void; label: string }>) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-10 h-6 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron flex-shrink-0',
        checked ? 'bg-saffron' : 'bg-neutral-200',
      )}
    >
      <span className={cn('absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform', checked && 'translate-x-4')} />
    </button>
  )
}

function SelectField({ value, onChange, options, label }: Readonly<{ value: string; onChange: (v: string) => void; options: string[]; label: string }>) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="text-sm font-semibold text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-saffron/30"
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState({
    language: 'English',
    theme: 'Light',
    push_notifications: true,
    email_notifications: true,
    sms_notifications: true,
    trip_reminders: true,
    marketing: false,
    share_location: false,
    data_collection: true,
    two_factor: false,
    biometric: false,
  })

  function update<K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) {
    setSettings((p) => ({ ...p, [key]: value }))
  }

  async function handleSignOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign-out failed:', error.message)
      return
    }
    router.push('/login')
  }

  return (
    <motion.div
      className="space-y-6 max-w-xl"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-500 text-sm mt-0.5">Customize your app experience</p>
      </div>

      {/* General */}
      <SettingSection icon={Globe} title="General">
        <SettingRow label="Language" description="Choose your preferred language">
          <SelectField
            label="Language"
            value={settings.language}
            onChange={(v) => update('language', v)}
            options={['English', 'Hindi', 'Both']}
          />
        </SettingRow>
        <SettingRow label="Theme" description="Light or dark mode">
          <SelectField
            label="Theme"
            value={settings.theme}
            onChange={(v) => update('theme', v)}
            options={['Light', 'Dark', 'System']}
          />
        </SettingRow>
      </SettingSection>

      {/* Notifications */}
      <SettingSection icon={Bell} title="Notifications">
        <SettingRow label="Push Notifications" description="Booking updates in-app">
          <Toggle checked={settings.push_notifications} onChange={(v) => update('push_notifications', v)} label="Push Notifications" />
        </SettingRow>
        <SettingRow label="SMS Notifications" description="Booking confirmations via SMS">
          <Toggle checked={settings.sms_notifications} onChange={(v) => update('sms_notifications', v)} label="SMS Notifications" />
        </SettingRow>
        <SettingRow label="Email Notifications" description="Receipts and updates">
          <Toggle checked={settings.email_notifications} onChange={(v) => update('email_notifications', v)} label="Email Notifications" />
        </SettingRow>
        <SettingRow label="Trip Reminders" description="Get reminded 24h before your trip">
          <Toggle checked={settings.trip_reminders} onChange={(v) => update('trip_reminders', v)} label="Trip Reminders" />
        </SettingRow>
        <SettingRow label="Promotions & Offers" description="Deals and reward updates">
          <Toggle checked={settings.marketing} onChange={(v) => update('marketing', v)} label="Promotions" />
        </SettingRow>
      </SettingSection>

      {/* Privacy */}
      <SettingSection icon={Eye} title="Privacy">
        <SettingRow label="Share Location" description="For better pickup experience">
          <Toggle checked={settings.share_location} onChange={(v) => update('share_location', v)} label="Share Location" />
        </SettingRow>
        <SettingRow label="Analytics & Data" description="Help us improve the app">
          <Toggle checked={settings.data_collection} onChange={(v) => update('data_collection', v)} label="Analytics" />
        </SettingRow>
      </SettingSection>

      {/* Security */}
      <SettingSection icon={Shield} title="Security">
        <SettingRow label="Two-Factor Authentication" description="Extra layer of security">
          <Toggle checked={settings.two_factor} onChange={(v) => update('two_factor', v)} label="2FA" />
        </SettingRow>
        <SettingRow label="Biometric Login" description="Use fingerprint or face ID">
          <Toggle checked={settings.biometric} onChange={(v) => update('biometric', v)} label="Biometric" />
        </SettingRow>
      </SettingSection>

      {/* App Info */}
      <SettingSection icon={Info} title="App Information">
        <SettingRow label="App Version" description="BusBook v1.0.0">
          <span className="text-xs text-neutral-400 font-mono">1.0.0</span>
        </SettingRow>
        <SettingRow label="Terms of Service" description="Read our legal terms">
          <a href="/terms" className="text-xs font-semibold text-royalBlue hover:underline">View</a>
        </SettingRow>
        <SettingRow label="Privacy Policy" description="How we handle your data">
          <a href="/privacy" className="text-xs font-semibold text-royalBlue hover:underline">View</a>
        </SettingRow>
      </SettingSection>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </motion.div>
  )
}
