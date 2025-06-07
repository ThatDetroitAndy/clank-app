'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'
import { Wrench, Eye, EyeOff, Loader2, X, CheckCircle, Sparkles } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  mode: 'login' | 'signup'
  onModeSwitch: (mode: 'login' | 'signup') => void
}

export default function AuthModal({ isOpen, onClose, onSuccess, mode, onModeSwitch }: AuthModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { signIn, signUp } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('') // Clear error when user types
  }

  const validateForm = () => {
    if (mode === 'signup') {
      if (!formData.name.trim()) {
        setError('Name is required')
        return false
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long')
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return false
      }
    }
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!validateForm()) return

    setIsLoading(true)
    console.log(`🔐 Auth modal: Starting ${mode} for`, formData.email)

    try {
      const result = mode === 'login' 
        ? await signIn(formData.email, formData.password)
        : await signUp(formData.email, formData.password, formData.name)
      
      if (result.error) {
        console.error(`❌ Auth modal ${mode} error:`, result.error.message)
        setError(result.error.message)
      } else {
        console.log(`✅ Auth modal ${mode} successful`)
        if (mode === 'signup') {
          setSuccess(true)
        } else {
          // Small delay to ensure auth state propagates
          setTimeout(() => {
            onSuccess()
          }, 500)
        }
      }
    } catch (error) {
      console.error(`❌ Auth modal ${mode} exception:`, error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', confirmPassword: '' })
    setError('')
    setSuccess(false)
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const handleModeSwitch = (newMode: 'login' | 'signup') => {
    resetForm()
    onModeSwitch(newMode)
  }

  if (!isOpen) return null

  if (success && mode === 'signup') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-gray-600 mb-4">
              We&apos;ve sent you a confirmation link at <strong>{formData.email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Click the link in the email to activate your account and continue using Clank.
            </p>
            <Button 
              onClick={() => handleModeSwitch('login')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Back to Sign In
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Wrench className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">Clank</h1>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              {mode === 'login' ? 'Welcome back!' : 'Join Clank today'}
            </h2>
            <p className="text-blue-100">
              {mode === 'login' 
                ? 'Continue your conversation with your automotive AI assistant' 
                : 'Get unlimited access to expert automotive AI assistance'
              }
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          {/* Benefits for signup */}
          {mode === 'signup' && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">What you&apos;ll get:</span>
              </div>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>&#8226; Unlimited conversations with Clank</li>
                <li>&#8226; Conversation history and saved diagnostics</li>
                <li>&#8226; Priority support and new features</li>
              </ul>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  disabled={isLoading}
                  className="h-12"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={isLoading}
                className="h-12"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={mode === 'login' ? 'Enter your password' : 'Create a password'}
                  required
                  disabled={isLoading}
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {mode === 'signup' && (
                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long</p>
              )}
            </div>

            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    disabled={isLoading}
                    className="h-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'login' ? 'Sign in' : 'Create account'
              )}
            </Button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {mode === 'login' ? "Don&apos;t have an account?" : "Already have an account?"}{' '}
              <button
                onClick={() => handleModeSwitch(mode === 'login' ? 'signup' : 'login')}
                className="text-blue-600 hover:text-blue-700 font-medium"
                disabled={isLoading}
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Terms for signup */}
          {mode === 'signup' && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                By creating an account, you agree to our{' '}
                <a href="/terms" className="text-blue-600 hover:text-blue-700">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-600 hover:text-blue-700">
                  Privacy Policy
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}