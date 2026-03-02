'use client'

import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  disabled?: boolean
}

export function OTPInput({ value, onChange, maxLength = 6, disabled = false }: Readonly<OTPInputProps>) {
  return (
    <InputOTP maxLength={maxLength} value={value} onChange={onChange} disabled={disabled}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}
