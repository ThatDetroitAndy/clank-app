'use client'

import AuthGuard from '@/components/auth/auth-guard'
import ChatWrapper from '@/components/chat/chat-wrapper'
import UserMenu from '@/components/auth/user-menu'
import { useAuth } from '@/contexts/auth-context'
import { Wrench } from 'lucide-react'

function DashboardContent() {
  const { profile } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900">Clank</h1>
              <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                Dashboard
              </span>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back{profile?.name ? `, ${profile.name}` : ''}!
          </h2>
          <p className="text-lg text-slate-600">
            Get expert help with vehicle diagnostics, maintenance, and repairs
          </p>
          <div className="mt-4 flex justify-center">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
              <span className="text-sm text-slate-600">
                Messages used: <span className="font-semibold">{profile?.messages_used || 0}</span>
                {profile?.subscription_tier === 'premium' ? ' / unlimited' : ' / 100'}
              </span>
              <span className="mx-2 text-slate-300">•</span>
              <span className="text-sm text-slate-600">
                Plan: <span className="font-semibold capitalize">{profile?.subscription_tier || 'Basic'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="max-w-4xl mx-auto">
          <ChatWrapper />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}