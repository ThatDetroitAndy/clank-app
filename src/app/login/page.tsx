import AuthGuard from '@/components/auth/auth-guard'
import LoginForm from '@/components/auth/login-form'
import { Wrench, Car, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Wrench className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900">Clank</h1>
              <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                Automotive AI
              </span>
            </Link>
          </div>
        </header>

        <div className="flex min-h-[calc(100vh-5rem)]">
          {/* Left Side - Branding and Features */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 text-white">
            <div className="flex flex-col justify-center max-w-lg">
              <div className="mb-8">
                <h2 className="text-4xl font-bold mb-4">Welcome back to Clank</h2>
                <p className="text-xl text-blue-100">
                  Continue getting expert automotive assistance from your AI-powered mechanic
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center">
                    <Car className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Vehicle Diagnostics</h3>
                    <p className="text-blue-100 text-sm">Expert troubleshooting for any vehicle issue</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Instant Support</h3>
                    <p className="text-blue-100 text-sm">Get immediate answers 24/7</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Safety First</h3>
                    <p className="text-blue-100 text-sm">Professional advice that prioritizes your safety</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <p className="text-sm text-blue-100 italic">
                  &ldquo;Clank helped me diagnose my transmission issue in minutes. Saved me a trip to the mechanic!&rdquo;
                </p>
                <p className="text-xs text-blue-200 mt-2">- Sarah M., Verified User</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <LoginForm redirectTo="/dashboard" />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}