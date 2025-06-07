/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AuthContextType, AuthUser, UserProfile, AuthState } from '@/types/auth'
import type { User } from '@supabase/supabase-js'

interface SupabaseResponse {
  data: any
  error: any
}

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
      console.log('📋 Fetching profile for user:', user.id)
      
      // Add timeout protection for profile fetch
      const profilePromise = supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout after 10 seconds')), 10000)
      )
      
      const { data: profile, error } = await Promise.race([profilePromise, timeoutPromise]) as SupabaseResponse

      if (error) {
        console.log('📋 Profile fetch error:', error.message, 'Code:', error.code)
        
        // If user doesn't exist in our database, create them
        if (error.code === 'PGRST116') {
          console.log('👤 User not found in database, creating profile...')
          const newUser = {
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.name || null,
            subscription_tier: 'basic',
            subscription_status: 'inactive',
            messages_used: 0,
          }

          const createPromise = supabase
            .from('users')
            .insert(newUser)
            .select()
            .single()
            
          const createTimeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Profile creation timeout after 10 seconds')), 10000)
          )

          const { data: createdProfile, error: createError } = await Promise.race([createPromise, createTimeoutPromise]) as SupabaseResponse

          if (createError) {
            console.error('❌ Error creating user profile:', createError)
            return null
          }

          console.log('✅ User profile created successfully')
          return createdProfile
        }
        console.error('❌ Profile fetch failed:', error)
        return null
      }

      console.log('✅ Profile fetched successfully')
      return profile
    } catch (error) {
      console.error('❌ Exception in fetchUserProfile:', error)
      return null
    }
  }, [supabase])

  // Initialize auth state
  useEffect(() => {
    console.log('🔄 Initializing auth context...')
    setState(prev => ({ ...prev, loading: false }))
    console.log('🔄 Auth context initialized - loading set to false')

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 Auth state changed:', event, session?.user?.email)
        
        if (session?.user) {
          try {
            console.log('👤 Session user found, fetching profile...')
            const profile = await fetchUserProfile(session.user)
            setState({
              user: session.user as AuthUser,
              profile,
              loading: false,
              error: null,
            })
            console.log('✅ Auth state updated with user and profile')
          } catch (error) {
            console.error('❌ Error fetching profile in auth state change:', error)
            setState({
              user: session.user as AuthUser,
              profile: null,
              loading: false,
              error: null,
            })
          }
        } else {
          console.log('👤 No session user, clearing auth state')
          setState({
            user: null,
            profile: null,
            loading: false,
            error: null,
          })
        }
      }
    )

    return () => {
      console.log('🧹 Cleaning up auth subscription')
      subscription.unsubscribe()
    }
  }, [supabase.auth]) // Removed fetchUserProfile to prevent infinite loops

  // Sign in
  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Starting sign in process for:', email)
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      // Add timeout protection for Supabase call
      console.log('📡 Making Supabase signin request...')
      const signinPromise = supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Signin request timeout after 15 seconds')), 15000)
      )
      
      const { data, error } = await Promise.race([signinPromise, timeoutPromise]) as SupabaseResponse

      if (error) {
        console.error('❌ Sign in error:', error)
        setState(prev => ({ ...prev, loading: false, error: error.message }))
        return { error }
      }

      console.log('✅ Sign in successful:', data.user?.email)
      console.log('👤 User data received:', !!data.user)
      
      // Handle successful signin with proper error handling
      if (data.user) {
        try {
          console.log('📋 Fetching user profile...')
          const profile = await fetchUserProfile(data.user)
          console.log('✅ Profile fetched:', !!profile)
          
          setState({
            user: data.user as AuthUser,
            profile,
            loading: false,
            error: null,
          })
          
          console.log('🎉 Auth context signin completed successfully')
        } catch (profileError) {
          console.error('⚠️ Profile fetch failed, but signin succeeded:', profileError)
          // Set user without profile if profile fetch fails
          setState({
            user: data.user as AuthUser,
            profile: null,
            loading: false,
            error: null,
          })
        }
      } else {
        console.warn('⚠️ No user data in signin response')
        setState(prev => ({ ...prev, loading: false }))
      }
      
      return { error: null }
    } catch (error) {
      console.error('❌ Sign in exception:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('📋 Error details:', errorMessage)
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