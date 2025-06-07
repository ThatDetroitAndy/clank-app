import ChatWrapper from '@/components/chat/chat-wrapper'
import UserMenu from '@/components/auth/user-menu'
import { Wrench, Car, Zap, Shield } from 'lucide-react'

export default function Home() {
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
                Automotive AI Assistant
              </span>
            </div>
            <nav className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-6">
                <a href="#features" className="text-slate-600 hover:text-slate-900">Features</a>
                <a href="#pricing" className="text-slate-600 hover:text-slate-900">Pricing</a>
                <a href="#about" className="text-slate-600 hover:text-slate-900">About</a>
              </div>
              <UserMenu />
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Your AI-Powered Automotive Expert
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Get instant help with vehicle diagnostics, maintenance, and repairs from Clank, 
            your intelligent automotive assistant powered by advanced AI.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <Car className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Vehicle Diagnostics</h3>
            <p className="text-slate-600">
              Get expert help identifying and troubleshooting vehicle issues with step-by-step guidance.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <Zap className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Instant Answers</h3>
            <p className="text-slate-600">
              Get immediate responses to your automotive questions, available 24/7 whenever you need help.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <Shield className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Safety First</h3>
            <p className="text-slate-600">
              All advice prioritizes your safety with clear warnings about when to seek professional help.
            </p>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-6">
            Try Clank Now
          </h3>
          <ChatWrapper />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600">
            <p>&copy; 2024 Clank Automotive AI. Built with Next.js, OpenAI, and Supabase.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
