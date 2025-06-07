import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
}

export const SUBSCRIPTION_PLANS = {
  basic: {
    name: 'Basic',
    price: 9.99,
    messages: 100,
    features: ['Basic diagnostics', 'Maintenance reminders', 'Email support']
  },
  pro: {
    name: 'Pro',
    price: 19.99,
    messages: 500,
    features: ['Advanced diagnostics', 'Custom repair guides', 'Priority support', 'Vehicle history tracking']
  },
  premium: {
    name: 'Premium',
    price: 39.99,
    messages: -1, // unlimited
    features: ['Unlimited messages', 'Expert mechanic consultations', 'Video diagnostics', 'Phone support']
  }
} as const