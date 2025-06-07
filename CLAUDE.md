# Claude Rules for Clank Automotive AI Project

## Project Overview
This is **Clank**, an automotive AI chat application built with Next.js, TypeScript, Tailwind CSS, Supabase, OpenAI, and Stripe. Always maintain the automotive theme and professional quality.

### Critical Rules - DO NOT VIOLATE

- **NEVER create mock data or simplified components** unless explicitly told to do so

- **NEVER replace existing complex components with simplified versions** - always fix the actual problem

- **ALWAYS work with the existing codebase** - do not create new simplified alternatives

- **ALWAYS find and fix the root cause** of issues instead of creating workarounds

- When debugging issues, focus on fixing the existing implementation, not replacing it

- When something doesn't work, debug and fix it - don't start over with a simple version

- **ALWAYS check MUI X v8 AND MUI v7 DOCS before making changes** to MUI-related components - they have breaking changes

### TypeScript and Linting

- ALWAYS add explicit types to all function parameters, variables, and return types

- ALWAYS run `pnpm build` or appropriate linter command before considering any code changes complete

- Fix all linter and TypeScript errors immediately - don't leave them for the user to fix

- When making changes to multiple files, check each one for type errors

### Prisma Usage

- NEVER use raw SQL queries ($queryRaw, $queryRawUnsafe) - always use Prisma Client methods

- When relations don't exist in the schema, use separate queries with findMany() and create lookup maps

- Always check the Prisma schema before assuming relations exist

### MUI Component Guidelines

- ALWAYS check MUI X v8 AND MUI V7 DOCS before making changes to related components. They are very new versions and likely have breaking changes you do not know about.

## Development Rules

### 🔧 Code Quality & Standards
- **Always use TypeScript** - Never write plain JavaScript
- **Follow existing code patterns** - Match the established architecture
- **Use existing UI components** from `src/components/ui/` before creating new ones
- **Maintain automotive branding** - Use Wrench icon, blue color scheme (#3b82f6), "Clank" branding
- **Production-ready code only** - Include proper error handling, loading states, and validation

### 🗄️ Database & Authentication
- **Use Supabase SSR patterns** - Always use `createClient` from appropriate server/client modules
- **Respect authentication** - Protected routes require auth, use AuthGuard component
- **Follow database schema** - Refer to `supabase-schema.sql` for table structure
- **Handle user profiles** - Auto-create user records when they sign up

### 🎨 UI/UX Guidelines
- **Consistent styling** - Use Tailwind CSS classes, follow existing color scheme
- **Responsive design** - Mobile-first approach, test on different screen sizes
- **Automotive theme** - Professional, clean, trustworthy appearance
- **Loading states** - Always show loading indicators for async operations
- **Error handling** - User-friendly error messages with clear next steps

### 🤖 AI Integration
- **OpenAI GPT-4o-mini** - Use for cost-effective automotive responses
- **Automotive expertise** - Maintain the AUTOMOTIVE_SYSTEM_PROMPT for consistent responses
- **Safety first** - Always prioritize user safety in automotive advice
- **Professional recommendations** - Guide users to mechanics when needed

### 📝 Development Workflow
- **Build before deploy** - Always run `npm run build` to check for errors
- **Fix ESLint errors** - Zero tolerance for linting errors in production
- **Test authentication flows** - Verify login, signup, protected routes work
- **Check API endpoints** - Ensure all routes return proper responses

### 🔐 Security & Environment
- **Protect API keys** - Never commit real keys, use environment variables
- **Server-side auth** - Use middleware for route protection
- **Input validation** - Validate all user inputs on both client and server
- **Error boundaries** - Graceful error handling throughout the app

### 📁 File Organization
- Components in `src/components/` with logical subdirectories
- Pages in `src/app/` following Next.js App Router structure  
- Types in `src/types/` with clear, reusable interfaces
- Utilities in `src/lib/` for shared functionality
- Auth components in `src/components/auth/`

### 🚀 Deployment Commands
- **Development**: `npm run dev` (http://localhost:3000)
- **Build**: `npm run build` (must pass before deployment)
- **Production**: `npm run start` (after successful build)
- **Linting**: `npm run lint` (fix all errors)

### ❌ Never Do
- Commit environment variables with real values
- Create components without proper TypeScript types
- Skip error handling in API routes
- Use non-automotive branding or themes
- Deploy without testing authentication flows
- Create security vulnerabilities with unprotected routes

### ✅ Always Do
- Use the TodoWrite tool for complex tasks to track progress
- Test the complete user journey (signup → login → chat → logout)
- Maintain message limits based on subscription tiers
- Keep the automotive focus in all AI responses
- Update user profiles and message counts properly
- Use proper loading and error states

## Quick Reference

### Key Components
- `AuthProvider` - Wraps entire app for authentication context
- `AuthGuard` - Protects routes that require authentication
- `UserMenu` - Navigation and user account management
- `ChatInterface` - Main chat component with OpenAI integration
- `LoginForm` / `SignupForm` - Authentication forms

### Important Files
- `middleware.ts` - Route protection and session management
- `src/lib/supabase/` - Database client configurations
- `src/app/api/chat/route.ts` - OpenAI chat endpoint
- `src/contexts/auth-context.tsx` - Authentication state management
- `supabase-schema.sql` - Database schema and RLS policies

### Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

---

**Remember**: Clank is a professional automotive AI assistant. Every feature should enhance the user's automotive experience while maintaining the highest standards of code quality and user safety.