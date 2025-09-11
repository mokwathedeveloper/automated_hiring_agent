# Automated Hiring Agent - Comprehensive Codebase Index

## Project Overview
🤖 **Automated Hiring Agent** is a comprehensive AI-powered resume analysis platform designed specifically for the Nigerian job market. It streamlines hiring processes with intelligent candidate evaluation, WhatsApp integration, payment processing, and comprehensive analytics.

## Tech Stack

### **Frontend**
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI + shadcn/ui components
- **State Management**: React Query (@tanstack/react-query)
- **Animations**: Framer Motion
- **Icons**: Lucide React + React Icons

### **Backend & APIs**
- **Runtime**: Next.js API Routes (serverless)
- **AI Processing**: OpenAI GPT-3.5-turbo + DeepSeek (fallback)
- **File Processing**: pdf-parse, mammoth
- **Validation**: Zod schemas + Joi validation
- **Security**: Rate limiting, CORS, input sanitization

### **Database & Authentication**
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with magic links
- **Security**: Row Level Security (RLS) policies
- **Real-time**: Supabase subscriptions

### **External Integrations**
- **Payments**: Paystack (Nigerian payment gateway)
- **WhatsApp**: Twilio WhatsApp Business API
- **Deployment**: Vercel
- **Monitoring**: Built-in analytics and logging

### **Development & Testing**
- **Testing**: Jest + Testing Library
- **Linting**: ESLint + Prettier
- **Type Safety**: TypeScript strict mode
- **Package Management**: npm

## Project Structure

```
automated_hiring_agent/
├── 📁 src/                          # Source code
│   ├── 📁 app/                      # Next.js App Router
│   │   ├── 📁 api/                  # API routes
│   │   │   ├── 📁 auth/             # Authentication endpoints
│   │   │   ├── 📁 candidates/       # Candidate management
│   │   │   ├── 📁 parse/            # Resume parsing & analysis
│   │   │   ├── 📁 payment/          # Payment processing
│   │   │   ├── 📁 resumes/          # Resume storage
│   │   │   └── 📁 whatsapp/         # WhatsApp integration
│   │   ├── 📁 auth/                 # Authentication pages
│   │   ├── 📁 dashboard/            # User dashboard
│   │   ├── 📁 pricing/              # Pricing page
│   │   ├── 📁 contact/              # Contact page
│   │   ├── 📁 privacy/              # Privacy policy
│   │   ├── 📁 terms/                # Terms of service
│   │   ├── 📄 layout.tsx            # Root layout
│   │   ├── 📄 page.tsx              # Homepage
│   │   └── 📄 globals.css           # Global styles
│   ├── 📁 components/               # React components
│   │   ├── 📁 ui/                   # shadcn/ui components
│   │   ├── 📄 AuthModal.tsx         # Authentication modal
│   │   ├── 📄 Dashboard.tsx         # Main dashboard
│   │   ├── 📄 Hero.tsx              # Landing page hero
│   │   ├── 📄 Navbar.tsx            # Navigation
│   │   ├── 📄 ResumeUploader.tsx    # File upload component
│   │   ├── 📄 Pricing.tsx           # Pricing component
│   │   └── 📄 WhatsAppModal.tsx     # WhatsApp integration
│   ├── 📁 lib/                      # Utility libraries
│   │   ├── 📁 supabase/             # Supabase configuration
│   │   ├── 📄 openai.ts             # AI integration
│   │   ├── 📄 paystack.ts           # Payment processing
│   │   ├── 📄 twilio.ts             # WhatsApp integration
│   │   ├── 📄 security.ts           # Security utilities
│   │   ├── 📄 validation.ts         # Schema validation
│   │   └── 📄 utils.ts              # General utilities
│   ├── 📁 hooks/                    # Custom React hooks
│   │   ├── 📄 useAuth.ts            # Authentication hook
│   │   └── 📄 use-toast.ts          # Toast notifications
│   └── 📁 types/                    # TypeScript definitions
│       ├── 📄 index.ts              # Core types
│       ├── 📄 database.ts           # Database types
│       ├── 📄 supabase.ts           # Supabase types
│       └── 📄 user.ts               # User types
├── 📁 migrations/                   # Database migrations
│   └── 📁 supabase/                 # Supabase SQL migrations
├── 📁 __tests__/                    # Test files
│   ├── 📁 api/                      # API tests
│   ├── 📁 components/               # Component tests
│   ├── 📁 hooks/                    # Hook tests
│   └── 📁 lib/                      # Library tests
├── 📁 doc/                          # Documentation
│   ├── 📄 CHANGELOG.md              # Project changelog
│   ├── 📄 deployment-checklist.md   # Deployment guide
│   └── 📄 feat-*.md                 # Feature documentation
├── 📁 public/                       # Static assets
├── 📁 scripts/                      # Build scripts
├── 📄 middleware.ts                 # Next.js middleware
├── 📄 package.json                  # Dependencies
├── 📄 next.config.js                # Next.js configuration
├── 📄 tailwind.config.ts            # Tailwind configuration
└── 📄 tsconfig.json                 # TypeScript configuration
```

## Core Features & Functionality

### 🎯 **Resume Analysis Engine**
- **AI-Powered Parsing**: OpenAI GPT-3.5-turbo with Nigerian market optimization
- **Multi-format Support**: PDF, DOCX file processing
- **Structured Extraction**: Name, email, phone, skills, experience, education
- **Intelligent Scoring**: 1-100 scoring system with detailed feedback
- **Batch Processing**: Multiple resume analysis capability

### 🔐 **Authentication & Security**
- **Magic Link Auth**: Passwordless authentication via Supabase
- **Row Level Security**: Database-level access control
- **Rate Limiting**: 50 requests per 15 minutes per IP
- **Input Sanitization**: XSS protection and data validation
- **CORS Protection**: Cross-origin request security

### 💬 **WhatsApp Integration**
- **Twilio Integration**: WhatsApp Business API
- **Media Handling**: Resume upload via WhatsApp
- **Session Management**: Persistent conversation state
- **Automated Responses**: Intelligent conversation flow

### 💳 **Payment System**
- **Paystack Integration**: Nigerian payment gateway
- **Subscription Plans**: Free, Pro, Enterprise tiers
- **Usage Tracking**: Resume analysis limits
- **Webhook Verification**: Secure payment confirmation

### 📊 **Dashboard & Analytics**
- **User Dashboard**: Analysis history and statistics
- **Real-time Updates**: Live data synchronization
- **Performance Metrics**: Average scores and trends
- **Export Capabilities**: Data download functionality

## Database Schema

### **Core Tables**
```sql
-- User profiles (extends Supabase auth.users)
profiles (
  id: uuid (FK to auth.users),
  first_name: text,
  last_name: text,
  full_name: text,
  avatar_url: text,
  website: text
)

-- Resume storage and analysis
resumes (
  id: uuid,
  user_id: uuid (FK),
  filename: text,
  content: text,
  analysis: jsonb,
  score: integer (0-100),
  status: enum('pending', 'processing', 'completed', 'failed')
)

-- Detailed analysis results
analyses (
  id: uuid,
  resume_id: uuid (FK),
  user_id: uuid (FK),
  analysis_type: enum('skills', 'experience', 'education', 'overall'),
  analysis_data: jsonb,
  recommendations: text[],
  strengths: text[],
  weaknesses: text[]
)

-- Subscription management
subscriptions (
  id: uuid,
  user_id: uuid (FK),
  plan_id: text,
  amount: integer, -- in kobo (NGN)
  status: enum('pending', 'active', 'cancelled', 'expired'),
  payment_reference: text,
  paystack_subscription_code: text
)

-- WhatsApp session tracking
whatsapp_sessions (
  id: uuid,
  user_id: uuid (FK),
  phone_number: text,
  session_data: jsonb,
  status: enum('active', 'inactive', 'expired')
)
```

## API Endpoints

### **Resume Processing**
- `POST /api/parse` - Single resume analysis
- `POST /api/parse/batch` - Batch resume processing
- `GET /api/resumes` - User's resume history
- `POST /api/resumes` - Store resume analysis

### **Authentication**
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints
- `GET /api/auth/callback` - OAuth callbacks

### **Payment Processing**
- `POST /api/payment` - Initialize payment
- `POST /api/payment/verify` - Verify payment status
- `POST /api/payment/webhook` - Paystack webhooks

### **WhatsApp Integration**
- `POST /api/whatsapp` - Twilio webhook handler
- `GET /api/whatsapp/status` - Session status

### **Candidate Management**
- `GET /api/candidates` - Retrieve candidates
- `POST /api/candidates` - Create candidate profile

## Key Components Deep Dive

### **ResumeUploader Component** (`src/components/ResumeUploader.tsx`)
- **Drag & Drop**: React Dropzone integration
- **File Validation**: Type, size, and content validation
- **Progress Tracking**: Real-time upload progress
- **Error Handling**: Comprehensive error states
- **Security**: Client-side file sanitization

### **Dashboard Component** (`src/components/Dashboard.tsx`)
- **Analytics Display**: Statistics and metrics
- **Resume History**: Paginated analysis results
- **Real-time Updates**: Supabase subscriptions
- **Responsive Design**: Mobile-first approach

### **AuthModal Component** (`src/components/AuthModal.tsx`)
- **Magic Link Flow**: Passwordless authentication
- **Form Validation**: React Hook Form + Zod
- **Error States**: User-friendly error handling
- **Loading States**: Smooth UX transitions

### **OpenAI Integration** (`src/lib/openai.ts`)
- **Multi-Provider Support**: OpenAI + DeepSeek fallback
- **Key Rotation**: Automatic API key switching
- **Error Handling**: Comprehensive error recovery
- **Rate Limiting**: Built-in request throttling

### **Security Layer** (`src/lib/security.ts`)
- **Input Sanitization**: XSS protection
- **Rate Limiting**: IP-based throttling
- **File Validation**: Secure upload handling
- **CORS Management**: Cross-origin security

## Environment Configuration

### **Required Environment Variables**
```env
# AI Processing
OPENAI_API_KEY_1=sk-...                    # Primary OpenAI key
OPENAI_API_KEY_2=sk-...                    # Backup OpenAI key
DEEPSEEK_API_KEY_1=sk-...                  # DeepSeek fallback
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1

# Database & Auth
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-32-char-secret

# Payment Processing
PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_SECRET_KEY=sk_test_...

# WhatsApp Integration
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

## Testing Strategy

### **Test Coverage Areas**
- ✅ **API Endpoints**: All routes tested with Jest
- ✅ **Components**: React Testing Library integration
- ✅ **Authentication**: Login/logout flows
- ✅ **File Processing**: Upload and parsing validation
- ✅ **Payment Flow**: Paystack integration testing
- ✅ **WhatsApp**: Message handling and validation
- ✅ **Security**: Rate limiting and input validation

### **Test Commands**
```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
npm test auth.test.tsx     # Specific test file
```

## Deployment & DevOps

### **Deployment Platforms**
- **Primary**: Vercel (recommended)
- **Database**: Supabase (managed PostgreSQL)
- **CDN**: Vercel Edge Network
- **Monitoring**: Built-in Vercel Analytics

### **Build Configuration**
- **Next.js**: App Router with SSR/SSG
- **TypeScript**: Strict mode compilation
- **Tailwind**: JIT compilation
- **Bundle Analysis**: Built-in optimization

### **Performance Optimizations**
- **Rate Limiting**: 50 requests/15min per IP
- **Caching**: React Query client-side caching
- **Image Optimization**: Next.js automatic optimization
- **Bundle Splitting**: Automatic code splitting
- **Edge Functions**: Vercel Edge Runtime

## Development Workflow

### **Getting Started**
```bash
# Clone repository
git clone https://github.com/mokwathedeveloper/automated_hiring_agent.git
cd automated_hiring_agent

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your keys

# Run development server
npm run dev
```

### **Code Standards**
- **TypeScript**: Strict mode with comprehensive typing
- **ESLint**: Airbnb configuration + Next.js rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Structured commit messages

### **Branch Strategy**
- **main**: Production-ready code
- **develop**: Integration branch
- **feature/***: Feature development
- **fix/***: Bug fixes
- **test/***: Test improvements

## Nigerian Market Specialization

### **Local Optimizations**
- **University Recognition**: Nigerian institution database
- **Phone Format**: +234 number validation
- **Payment Gateway**: Paystack integration
- **Currency**: Naira (NGN) pricing
- **Time Zone**: WAT (West Africa Time)

### **Educational Institutions**
- University of Lagos (UNILAG)
- University of Ibadan (UI)
- Obafemi Awolowo University (OAU)
- University of Nigeria, Nsukka (UNN)
- Ahmadu Bello University (ABU)
- And 100+ other recognized institutions

## Performance Metrics

### **Current Benchmarks**
- **Resume Processing**: ~2-5 seconds per document
- **API Response Time**: <500ms average
- **File Upload**: 5MB max, <10s processing
- **Database Queries**: <100ms average
- **Page Load**: <2s First Contentful Paint

### **Scalability Targets**
- **Concurrent Users**: 1000+ simultaneous
- **Daily Analyses**: 10,000+ resumes
- **Storage**: Unlimited with Supabase
- **Uptime**: 99.9% availability target

---

## 📋 Quick Reference

### **Key Files to Know**
- `src/app/api/parse/route.ts` - Main resume processing
- `src/components/ResumeUploader.tsx` - File upload UI
- `src/lib/openai.ts` - AI integration
- `src/lib/security.ts` - Security utilities
- `middleware.ts` - Request middleware
- `package.json` - Dependencies and scripts

### **Common Commands**
```bash
npm run dev          # Development server
npm run build        # Production build
npm run test         # Run tests
npm run lint         # Code linting
npm run migrate      # Database migrations
```

### **Support & Documentation**
- **GitHub**: Repository issues and discussions
- **Documentation**: `/doc` directory
- **API Docs**: Inline code documentation
- **Testing**: Comprehensive test suite

---

**Built with ❤️ for the Nigerian tech ecosystem**

*Last Updated: 2025-09-11*