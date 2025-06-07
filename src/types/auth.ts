import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { Database } from './database'

export type DbUser = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type AuthUser = SupabaseUser

export interface UserProfile extends DbUser {
  // Add any computed fields or joined data here
  subscription_active?: boolean
}

export interface AuthState {
  user: AuthUser | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, name?: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updateProfile: (updates: Partial<UserUpdate>) => Promise<{ error: Error | null }>
  refreshProfile: () => Promise<void>
}