'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Settings, 
  LogOut, 
  CreditCard, 
  MessageSquare,
  ChevronDown 
} from 'lucide-react'

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { user, profile, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      onClick: () => router.push('/dashboard/profile'),
    },
    {
      icon: MessageSquare,
      label: 'Chat History',
      onClick: () => router.push('/dashboard/chat-history'),
    },
    {
      icon: CreditCard,
      label: 'Subscription',
      onClick: () => router.push('/dashboard/subscription'),
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => router.push('/dashboard/settings'),
    },
  ]

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => router.push('/login')}>
          Sign in
        </Button>
        <Button onClick={() => router.push('/signup')}>
          Sign up
        </Button>
      </div>
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-auto p-2"
      >
        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
          {profile?.name ? profile.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-slate-900">
            {profile?.name || 'User'}
          </p>
          <p className="text-xs text-slate-500">
            {profile?.subscription_tier || 'Basic'} Plan
          </p>
        </div>
        <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-900">
              {profile?.name || 'User'}
            </p>
            <p className="text-xs text-slate-500">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {profile?.subscription_tier || 'Basic'}
              </span>
              <span className="text-xs text-slate-500">
                {profile?.messages_used || 0}/100 messages
              </span>
            </div>
          </div>

          {/* Menu Items */}
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={index}
                onClick={() => {
                  item.onClick()
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            )
          })}

          <div className="border-t border-slate-100 mt-1">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}