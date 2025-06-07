'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Wrench, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/auth-context'
import AuthModal from '@/components/auth/auth-modal'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  userId?: string
  sessionId?: string
}

export default function ChatInterface({ sessionId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasUsedGuestMessage, setHasUsedGuestMessage] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { user, loading: authLoading } = useAuth()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (!isInitialized) {
      const welcomeMessage = user 
        ? "Hi! I'm Clank, your automotive AI assistant. I'm here to help you with vehicle diagnostics, maintenance, repairs, and general automotive questions. What can I help you with today?"
        : "Hi! I'm Clank, your automotive AI assistant. Try me out with a free question about your vehicle - I can help with diagnostics, maintenance, and repairs. What would you like to know?"
      
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: welcomeMessage,
          timestamp: new Date()
        }
      ])
      setIsInitialized(true)
    }
  }, [isInitialized, user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    // Check if this is a guest user trying to send a second message
    if (!user && hasUsedGuestMessage) {
      setShowAuthModal(true)
      setAuthMode('signup')
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    const isGuestMessage = !user && !hasUsedGuestMessage

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: sessionId || 'demo-session',
          vehicleContext: null,
          isGuestMessage
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.needsAuth) {
          setShowAuthModal(true)
          setAuthMode('signup')
          return
        }
        throw new Error(data.error || 'Failed to send message')
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      // Mark that guest user has used their free message
      if (isGuestMessage) {
        setHasUsedGuestMessage(true)
        
        // Add a follow-up message encouraging signup
        setTimeout(() => {
          const signupPromptMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: "I hope that was helpful! To continue our conversation and get unlimited access to automotive expertise, you'll need to create a free account. Would you like to sign up?",
            timestamp: new Date()
          }
          setMessages(prev => [...prev, signupPromptMessage])
        }, 2000)
      }

    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    // The auth context will update and user will be available
  }

  const handleSignupClick = () => {
    setShowAuthModal(true)
    setAuthMode('signup')
  }

  const isGuestUser = !user && !authLoading

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-white rounded-lg border shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b bg-slate-50 rounded-t-lg">
        <Wrench className="h-5 w-5 text-blue-600" />
        <h2 className="font-semibold text-slate-900">Clank - Automotive AI Assistant</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-900'
              )}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className={cn(
                "text-xs mt-1 opacity-70",
                message.role === 'user' ? 'text-blue-100' : 'text-slate-500'
              )}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-lg px-4 py-2 text-sm text-slate-900">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-slate-50 rounded-b-lg">
        {/* Guest user prompt after first message */}
        {isGuestUser && hasUsedGuestMessage && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Want to continue?</span>
            </div>
            <p className="text-sm text-blue-800 mb-3">
              Create a free account to get unlimited conversations and save your chat history.
            </p>
            <Button 
              onClick={handleSignupClick}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign up free
            </Button>
          </div>
        )}
        
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              isGuestUser && hasUsedGuestMessage 
                ? "Sign up to continue chatting..." 
                : "Ask about vehicle diagnostics, maintenance, repairs..."
            }
            className="flex-1"
            disabled={isLoading || (isGuestUser && hasUsedGuestMessage)}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading || (isGuestUser && hasUsedGuestMessage)}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* First-time guest user hint */}
        {isGuestUser && !hasUsedGuestMessage && (
          <p className="text-xs text-slate-500 mt-2 text-center">
            Try Clank free - no signup required for your first question!
          </p>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        mode={authMode}
        onModeSwitch={setAuthMode}
      />
    </div>
  )
}