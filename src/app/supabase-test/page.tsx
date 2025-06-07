/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/auth-context'

interface SupabaseResponse {
  data: any
  error: any
}

interface AuthResult {
  error: any
}

export default function SupabaseTestPage() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('andy2@test.com')
  const [password, setPassword] = useState('password123')
  const { user, signIn: authSignIn } = useAuth()

  const addResult = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setResults(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const clearResults = () => setResults([])

  const testEnvironmentVariables = () => {
    addResult('🔍 Testing Environment Variables...')
    
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    addResult(`📍 NEXT_PUBLIC_SUPABASE_URL: ${url ? 'PRESENT ✅' : 'MISSING ❌'}`)
    addResult(`🔑 NEXT_PUBLIC_SUPABASE_ANON_KEY: ${key ? 'PRESENT ✅' : 'MISSING ❌'}`)
    
    if (url) {
      addResult(`📝 URL Format: ${url.startsWith('https://') && url.includes('.supabase.co') ? 'VALID ✅' : 'INVALID ❌'}`)
      addResult(`📝 URL Value: ${url}`)
    }
    
    if (key) {
      addResult(`📝 Key Format: ${key.startsWith('eyJ') ? 'VALID ✅' : 'INVALID ❌'}`)
      addResult(`📝 Key Length: ${key.length} characters`)
    }
  }

  const testSupabaseClient = async () => {
    addResult('🔍 Testing Supabase Client...')
    setLoading(true)
    
    try {
      const supabase = createClient()
      addResult('✅ Supabase client created successfully')
      
      // Test connection with a simple query
      const startTime = Date.now()
      const { error } = await supabase.from('users').select('count').limit(1)
      const endTime = Date.now()
      
      if (error) {
        addResult(`❌ Database query failed: ${error.message}`)
      } else {
        addResult(`✅ Database connection successful (${endTime - startTime}ms)`)
      }
      
    } catch (error) {
      addResult(`❌ Client creation failed: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testAuthSettings = async () => {
    addResult('🔍 Testing Auth Settings...')
    setLoading(true)
    
    try {
      const supabase = createClient()
      
      // Test auth session
      const { data: session, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        addResult(`❌ Session check failed: ${sessionError.message}`)
      } else {
        addResult(`✅ Session check successful`)
        addResult(`📝 Current user: ${session.session?.user?.email || 'None'}`)
      }
      
      // Test auth user
      const { data: user, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        addResult(`⚠️ User check warning: ${userError.message}`)
      } else {
        addResult(`✅ User check successful`)
        addResult(`📝 Auth user: ${user.user?.email || 'None'}`)
      }
      
    } catch (error) {
      addResult(`❌ Auth test failed: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testSignUp = async () => {
    if (!email || !password) {
      addResult('❌ Please enter email and password')
      return
    }
    
    addResult(`🔍 Testing Signup: ${email}`)
    setLoading(true)
    
    try {
      const supabase = createClient()
      
      // Add timeout protection
      const signupPromise = supabase.auth.signUp({
        email,
        password,
      })
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Signup timeout after 10 seconds')), 10000)
      )
      
      const { data, error } = await Promise.race([signupPromise, timeoutPromise]) as SupabaseResponse
      
      if (error) {
        addResult(`❌ Signup failed: ${error.message}`)
      } else {
        addResult(`✅ Signup successful!`)
        addResult(`📝 User ID: ${data.user?.id}`)
        addResult(`📝 Email confirmed: ${data.user?.email_confirmed_at ? 'Yes' : 'No'}`)
        addResult(`📝 Confirmation sent: ${data.user && !data.user.email_confirmed_at ? 'Yes' : 'No'}`)
      }
      
    } catch (error) {
      addResult(`❌ Signup exception: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  const testSignIn = async () => {
    if (!email || !password) {
      addResult('❌ Please enter email and password')
      return
    }
    
    addResult(`🔍 Testing Signin via Auth Context: ${email}`)
    setLoading(true)
    
    try {
      // Add timeout to prevent hanging
      const authPromise = authSignIn(email, password)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auth context timeout after 8 seconds')), 8000)
      )
      
      const result = await Promise.race([authPromise, timeoutPromise]) as AuthResult
      
      if (result.error) {
        addResult(`❌ Auth context signin failed: ${result.error.message}`)
      } else {
        addResult(`✅ Auth context signin successful!`)
        addResult(`📝 Current user: ${user?.email || 'Loading...'}`)
        
        // Wait a moment for user state to update
        setTimeout(() => {
          addResult(`📝 Updated user: ${user?.email || 'Still loading...'}`)
        }, 1000)
      }
      
    } catch (error) {
      addResult(`❌ Auth context signin exception: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  const testDirectSignIn = async () => {
    if (!email || !password) {
      addResult('❌ Please enter email and password')
      return
    }
    
    addResult(`🔍 Testing Direct Signin: ${email}`)
    setLoading(true)
    
    try {
      const supabase = createClient()
      
      // Log the request details
      addResult(`📝 Attempting signin with Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        addResult(`❌ Direct signin failed: ${error.message}`)
        addResult(`📝 Error code: ${error.status || 'N/A'}`)
      } else {
        addResult(`✅ Direct signin successful!`)
        addResult(`📝 User: ${data.user?.email}`)
        addResult(`📝 Session expires: ${data.session?.expires_at}`)
      }
      
    } catch (error) {
      addResult(`❌ Direct signin exception: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  const testSignOut = async () => {
    addResult('🔍 Testing Signout...')
    setLoading(true)
    
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        addResult(`❌ Signout failed: ${error.message}`)
      } else {
        addResult(`✅ Signout successful!`)
      }
      
    } catch (error) {
      addResult(`❌ Signout exception: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const runAllTests = async () => {
    clearResults()
    addResult('🚀 Starting comprehensive Supabase tests...')
    
    testEnvironmentVariables()
    await testSupabaseClient()
    await testAuthSettings()
    
    addResult('🎯 All basic tests completed!')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🧪 Supabase Connection Test</h1>
          <p className="text-gray-600 mb-6">
            Comprehensive testing of your Supabase configuration, connection, and authentication.
          </p>

          {/* Test Credentials */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
              />
            </div>
          </div>

          {/* Current User Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Current Auth Status</h3>
            <p className="text-sm text-blue-800">
              <strong>User:</strong> {user?.email || 'Not signed in'}<br/>
              <strong>Loading:</strong> {loading ? 'Yes' : 'No'}<br/>
              <strong>Profile:</strong> {user ? 'Loaded' : 'None'}
            </p>
          </div>

          {/* Test Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
            <Button onClick={runAllTests} disabled={loading} className="w-full">
              🚀 Run All Tests
            </Button>
            <Button onClick={testSignUp} disabled={loading} variant="outline" className="w-full">
              📝 Test Signup
            </Button>
            <Button onClick={testSignIn} disabled={loading} variant="outline" className="w-full">
              🔐 Auth Signin
            </Button>
            <Button onClick={testDirectSignIn} disabled={loading} variant="outline" className="w-full">
              🔗 Direct Signin
            </Button>
            <Button onClick={testSignOut} disabled={loading} variant="outline" className="w-full">
              🚪 Test Signout
            </Button>
          </div>

          <div className="flex gap-2 mb-4">
            <Button onClick={testEnvironmentVariables} size="sm" variant="ghost">
              🔍 Env Variables
            </Button>
            <Button onClick={testSupabaseClient} size="sm" variant="ghost" disabled={loading}>
              🔌 Connection
            </Button>
            <Button onClick={testAuthSettings} size="sm" variant="ghost" disabled={loading}>
              🔐 Auth Settings
            </Button>
            <Button onClick={clearResults} size="sm" variant="ghost">
              🗑️ Clear
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Test Results</h2>
          <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <div className="text-gray-500">No tests run yet. Click &quot;Run All Tests&quot; to begin.</div>
            ) : (
              results.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))
            )}
            {loading && (
              <div className="text-yellow-400 animate-pulse">
                ⏳ Running test...
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">📋 Test Instructions</h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li><strong>1. Run All Tests:</strong> Start with this to check basic connectivity</li>
            <li><strong>2. Test Signup:</strong> Create a new account with the test credentials</li>
            <li><strong>3. Test Signin:</strong> Sign in with the same credentials</li>
            <li><strong>4. Test Signout:</strong> Sign out to complete the auth flow</li>
          </ol>
        </div>
      </div>
    </div>
  )
}