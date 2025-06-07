'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Loader2, Wrench } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
  requireAuth?: boolean
}

export default function AuthGuard({ 
  children, 
  redirectTo = '/login',
  requireAuth = true 
}: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push(redirectTo)
      } else if (!requireAuth && user) {
        router.push('/dashboard')
      }
    }
  }, [user, loading, requireAuth, redirectTo, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wrench className="h-8 w-8 text-blue-600 animate-pulse" />
            <h1 className="text-2xl font-bold text-slate-900">Clank</h1>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (requireAuth && !user) {
    return null // Will redirect in useEffect
  }

  if (!requireAuth && user) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}