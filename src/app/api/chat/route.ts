import { NextRequest, NextResponse } from 'next/server'
import { openai, AUTOMOTIVE_SYSTEM_PROMPT } from '@/lib/openai'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { message, sessionId, vehicleContext, isGuestMessage } = await req.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    
    // Allow guest users to send their first message
    if (!user && !isGuestMessage) {
      return NextResponse.json(
        { error: 'Authentication required', needsAuth: true },
        { status: 401 }
      )
    }

    // Get user profile from database (skip for guest users)
    let userProfile = { subscription_tier: 'basic', messages_used: 0 }
    
    if (user) {
      try {
        const { data: dbUser } = await supabase
          .from('users')
          .select('subscription_tier, messages_used')
          .eq('id', user.id)
          .single()
        
        if (dbUser) {
          userProfile = dbUser
        }
      } catch {
        // User doesn't exist in database, use demo defaults
        console.log('User not found in database, using demo mode')
      }
    }

    // Check message limits based on subscription tier (skip for guest users)
    if (user && !isGuestMessage) {
      const limits = {
        basic: 100,
        pro: 500,
        premium: -1 // unlimited
      }

      const userLimit = limits[userProfile.subscription_tier as keyof typeof limits] || 0
      if (userLimit !== -1 && userProfile.messages_used >= userLimit) {
        return NextResponse.json(
          { error: 'Message limit exceeded. Please upgrade your subscription.' },
          { status: 403 }
        )
      }
    }

    // Get chat completion from OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using the faster, more cost-effective model
      messages: [
        { role: 'system', content: AUTOMOTIVE_SYSTEM_PROMPT },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const assistantMessage = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    // Save messages to database (only for authenticated users)
    if (user && sessionId && !isGuestMessage) {
      try {
        // Save user message
        await supabase.from('chat_messages').insert({
          session_id: sessionId,
          user_id: user.id,
          role: 'user',
          content: message,
          vehicle_context: vehicleContext
        })

        // Save assistant message
        await supabase.from('chat_messages').insert({
          session_id: sessionId,
          user_id: user.id,
          role: 'assistant',
          content: assistantMessage
        })

        // Update user's message count
        await supabase
          .from('users')
          .update({ messages_used: userProfile.messages_used + 1 })
          .eq('id', user.id)
      } catch (error) {
        console.log('Database save failed, continuing with demo mode:', error)
      }
    }

    return NextResponse.json({
      message: assistantMessage,
      isGuestMessage,
      needsAuthForNext: isGuestMessage,
      usage: user ? {
        messagesUsed: userProfile.messages_used + 1,
        messageLimit: userProfile.subscription_tier === 'premium' ? 'unlimited' : 
                     userProfile.subscription_tier === 'pro' ? 500 : 100
      } : null
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}