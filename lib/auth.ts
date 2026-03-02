import { createClient } from '@/lib/supabase/server'
import type { UserRole } from './types'
export type { UserRole } from './types'

export async function getUserRole(): Promise<UserRole | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  return (user.user_metadata?.role as UserRole) || 'customer'
}

export async function requireAuth(): Promise<{ userId: string; role: UserRole }> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    throw new Error('Unauthorized')
  }
  
  const role = (user.user_metadata?.role as UserRole) || 'customer'
  return { userId: user.id, role }
}

export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return false
  
  const userRole = (user.user_metadata?.role as UserRole) || 'customer'
  return userRole === requiredRole
}

export async function isDriver(): Promise<boolean> {
  return hasRole('operator')
}

export async function isAdmin(): Promise<boolean> {
  return hasRole('admin')
}

export async function isCustomer(): Promise<boolean> {
  return hasRole('customer')
}

export async function checkDriverVerified(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return false
  
  return user.user_metadata?.is_verified === true
}
