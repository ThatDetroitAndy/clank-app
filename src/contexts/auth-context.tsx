'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AuthContextType, AuthUser, UserProfile, AuthState } from '@/types/auth'
import type { User } from '@supabase/supabase-js'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  })

  const supabase = createClient()

  // Fetch user profile from database
  const fetchUserProfile = useCallback(async (user: User): Promise<UserProfile | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        // If user doesn't exist in our database, create them
        if (error.code === 'PGRST116') {
          const newUser = {
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.name || null,
            subscription_tier: 'basic',
            subscription_status: 'inactive',
            messages_used: 0,
          }

          const { data: createdProfile, error: createError } = await supabase
            .from('users')
            .insert(newUser)
            .select()
            .single()

          if (createError) {
            console.error('Error creating user profile:', createError)
            return null
          }

          return createdProfile
        }
        console.error('Error fetching user profile:', error)
        return null
      }

      return profile
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
      return null
    }
  }, [supabase])

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setState(prev => ({ ...prev, loading: false, error: error.message }))
          return
        }

        if (session?.user) {
          const profile = await fetchUserProfile(session.user)
          setState({
            user: session.user as AuthUser,
            profile,
            loading: false,
            error: null,
          })
        } else {
          setState({
            user: null,
            profile: null,
            loading: false,
            error: null,
          })
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }))
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user)
          setState({
            user: session.user as AuthUser,
            profile,
            loading: false,
            error: null,
          })
        } else {
          setState({
            user: null,
            profile: null,
            loading: false,
            error: null,
          })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchUserProfile, supabase.auth])

  // Sign in
  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }))
        return { error }
      }

      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return { error: new Error(errorMessage) }
    }
  }

  // Sign up
  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || '',
          }
        }
      })

      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }))
        return { error }
      }

      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return { error: new Error(errorMessage) }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
      }
    } catch (error) {
      console.error('Error in signOut:', error)
    }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        return { error }
      }

      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Unknown error') }
    }
  }

  // Update profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!state.user) {
        return { error: new Error('No user logged in') }
      }

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', state.user.id)

      if (error) {
        return { error: new Error(error.message) }
      }

      // Refresh profile
      await refreshProfile()
      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Unknown error') }
    }
  }

  // Refresh profile
  const refreshProfile = async () => {
    if (state.user) {
      const profile = await fetchUserProfile(state.user as User)
      setState(prev => ({ ...prev, profile }))
    }
  }

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}