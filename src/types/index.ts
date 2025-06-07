export interface User {
  id: string
  email: string
  name?: string
  subscription_tier?: 'basic' | 'pro' | 'premium'
  subscription_status?: 'active' | 'canceled' | 'past_due'
  messages_used?: number
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  user_id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  vehicle_context?: VehicleContext
}

export interface VehicleContext {
  make?: string
  model?: string
  year?: number
  engine?: string
  mileage?: number
  issue_type?: string
}

export interface ChatSession {
  id: string
  user_id: string
  title: string
  messages: ChatMessage[]
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string
  stripe_customer_id: string
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  plan: 'basic' | 'pro' | 'premium'
  current_period_end: string
  created_at: string
  updated_at: string
}