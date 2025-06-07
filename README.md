# Clank - Automotive AI Chat Application

Clank is an intelligent automotive assistant built with Next.js, TypeScript, Tailwind CSS, Supabase, OpenAI, and Stripe. It provides expert help with vehicle diagnostics, maintenance, and repairs through an AI-powered chat interface.

## 🚀 Features

- **AI-Powered Chat**: Intelligent automotive assistance using OpenAI's GPT-4
- **User Authentication**: Secure authentication with Supabase Auth
- **Subscription Management**: Tiered pricing with Stripe integration
- **Real-time Chat**: Responsive chat interface with message history
- **Database Integration**: PostgreSQL database with Supabase
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4
- **Payments**: Stripe
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd clank-new
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`
   - Fill in your API keys and configuration values

4. **Set up Supabase:**
   - Create a new Supabase project
   - Run the SQL schema from `supabase-schema.sql`
   - Update environment variables with your Supabase credentials

5. **Set up OpenAI:**
   - Get your API key from OpenAI
   - Add it to your environment variables

6. **Set up Stripe:**
   - Create a Stripe account
   - Get your publishable and secret keys
   - Add them to your environment variables

7. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🗄️ Database Schema

The application uses the following main tables:

- **users**: User profiles and subscription information
- **chat_sessions**: Chat session management
- **chat_messages**: Individual chat messages
- **subscriptions**: Stripe subscription data

Run the SQL commands in `supabase-schema.sql` to set up your database.

## 🔑 Environment Variables

Required environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/          # Chat API endpoints
│   │   ├── stripe/        # Stripe webhook handlers
│   │   └── auth/          # Authentication endpoints
│   ├── dashboard/         # User dashboard pages
│   ├── pricing/           # Pricing page
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # Reusable UI components
│   └── chat/              # Chat-specific components
├── lib/
│   ├── supabase.ts        # Supabase client configuration
│   ├── openai.ts          # OpenAI client configuration
│   ├── stripe.ts          # Stripe configuration
│   └── utils.ts           # Utility functions
└── types/
    └── index.ts           # TypeScript type definitions
```

## 📋 API Endpoints

- `POST /api/chat` - Send chat messages to AI
- `POST /api/stripe/webhook` - Handle Stripe webhooks
- `GET /api/auth/session` - Get current user session

## 🎯 Usage

1. **Start a Chat**: Users can immediately start chatting with Clank
2. **Vehicle Context**: Users can provide vehicle details for more specific help
3. **Message Limits**: Based on subscription tier (Basic: 100, Pro: 500, Premium: unlimited)
4. **Subscription Management**: Users can upgrade/downgrade through Stripe

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

- ESLint for code linting
- TypeScript for type safety
- Prettier for code formatting (recommended)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact [your-email] or create an issue in the GitHub repository.

---

Built with ❤️ for the automotive community
