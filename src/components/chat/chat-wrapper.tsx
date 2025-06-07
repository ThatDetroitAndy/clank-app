'use client'

import dynamic from 'next/dynamic'

const ChatInterface = dynamic(() => import('./chat-interface'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col h-full max-h-[600px] bg-white rounded-lg border shadow-sm">
      <div className="flex items-center gap-2 p-4 border-b bg-slate-50 rounded-t-lg">
        <div className="h-5 w-5 bg-blue-600 rounded animate-pulse" />
        <h2 className="font-semibold text-slate-900">Loading Clank...</h2>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-slate-500">Setting up your automotive AI assistant...</div>
      </div>
    </div>
  )
})

interface ChatWrapperProps {
  userId?: string
  sessionId?: string
}

export default function ChatWrapper({ userId, sessionId }: ChatWrapperProps) {
  return <ChatInterface userId={userId} sessionId={sessionId} />
}