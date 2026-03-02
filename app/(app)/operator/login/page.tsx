'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Bus } from 'lucide-react'

export default function OperatorLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      const role = data.user?.user_metadata?.role

      if (role !== 'operator') {
        await supabase.auth.signOut()
        setError('This login is for operators only. Please use the customer login.')
        return
      }

      router.push('/operator/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md shadow-2xl shadow-primary/5 border-border">
        <CardHeader className="text-center pb-8 border-b border-border/50 bg-muted/30">
          <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-primary via-primary-dark to-black rounded-2xl rotate-3 flex items-center justify-center shadow-lg shadow-primary/20">
            <Bus className="h-8 w-8 text-gold -rotate-3" />
          </div>
          <CardTitle className="text-3xl font-display font-bold tracking-tight text-primary">Operator Portal</CardTitle>
          <CardDescription className="text-muted-foreground font-medium text-base mt-2">Sign in to manage your fleet</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <Label htmlFor="email" className="text-foreground font-semibold">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="operator@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-foreground font-semibold">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-display tracking-wide font-semibold shadow-md py-6 rounded-lg mt-4" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-8">
              Want to join as an operator?{' '}
              <a href="/operator/register" className="font-semibold text-primary underline underline-offset-4 hover:text-accent transition-colors">
                Apply here
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
