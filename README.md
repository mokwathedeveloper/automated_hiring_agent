# 🚀 HiringAgent - Automated Resume Analysis & Candidate Management

A modern, AI-powered hiring platform that automates resume parsing, candidate management, and communication workflows. Built with Next.js, Supabase, and integrated WhatsApp messaging for streamlined hiring processes.

![HiringAgent Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14.0.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)

## ✨ Features

### 🎯 **Core Functionality**
- **AI-Powered Resume Parsing**: Automatically extract candidate information from PDF resumes
- **Candidate Management**: Comprehensive dashboard for managing candidates and applications
- **Real-time Updates**: Live data synchronization with automatic refresh every 30 seconds
- **Responsive Design**: Mobile-first design with cards (mobile/tablet) and table (desktop) views
- **Search & Filter**: Real-time search across candidate names, emails, phone numbers, and skills

### 🔐 **Authentication & Security**
- **Magic Link Authentication**: Passwordless login via Supabase Auth
- **Row Level Security**: Database-level access control
- **Rate Limiting**: API protection against abuse (100 requests/15 minutes)
- **File Validation**: Strict type and size checking (PDF/DOCX, max 5MB)

### 💬 **WhatsApp Integration**
- **Message Templates**: Pre-built templates for interview invitations, follow-ups, and job offers
- **Real-time Status**: Live configuration checking and status indicators
- **Interactive Setup**: Built-in guide for Twilio WhatsApp API configuration
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Candidate Context**: Shows candidate skills, experience, and contact info in messaging interface

### 📊 **Dashboard Features**
- **Candidate Overview**: View all candidates in responsive cards or table format
- **Statistics Dashboard**: Live metrics showing total candidates, recent uploads, and system status
- **Resume Upload**: Drag-and-drop interface for uploading and parsing resumes
- **WhatsApp Integration**: Send messages directly from candidate cards with one click
- **Auto-refresh**: Data updates automatically every 30 seconds for real-time information

### 💳 **Payment & Subscriptions**
- **Paystack Integration**: Nigerian payment gateway
- **Tiered Pricing**: Free, Pro, and Enterprise plans
- **Usage Tracking**: Resume analysis limits and monitoring
- **Subscription Management**: Automated billing and renewals

### 📊 **Analytics & Dashboard**
- **User Dashboard**: Analysis history and statistics
- **Performance Metrics**: Average scores and trends
- **Resume Storage**: Persistent analysis results
- **Export Capabilities**: Data download and reporting

## 🛠 Tech Stack

### **Frontend**
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React Query**: Client-side caching and state management
- **React Icons & Lucide**: Modern icon libraries

### **Backend**
- **Next.js API Routes**: Serverless functions
- **PDF-Parse**: Resume parsing and text extraction
- **Joi**: Input validation and security
- **Twilio**: WhatsApp Business API integration

### **Database & Auth**
- **Supabase**: PostgreSQL database and authentication
- **Row Level Security**: Data protection policies
- **Real-time Subscriptions**: Live data updates

### **External Services**
- **Twilio**: WhatsApp Business API
- **Paystack**: Payment processing
- **Vercel**: Deployment and hosting

### **Development Tools**
- **Jest**: Testing framework
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- DeepSeek API key
- Twilio account (for WhatsApp)
- Paystack account (for payments)

### 1. Clone Repository
```bash
git clone https://github.com/mokwathedeveloper/automated_hiring_agent.git
cd automated_hiring_agent
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create `.env.local` file with the following configuration:

```env
# DeepSeek Configuration
DEEPSEEK_API_KEY_1=sk-your-deepseek-api-key-here
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-minimum-32-characters

# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Paystack Configuration (Nigerian Payment Gateway)
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Environment Variables Guide:**
- **DeepSeek**: Get API key from [DeepSeek Platform](https://platform.deepseek.com/api_keys)
- **Supabase**: Create project at [Supabase Dashboard](https://supabase.com/dashboard)
- **NextAuth**: Generate secret with `openssl rand -base64 32`
- **Twilio**: Sign up at [Twilio Console](https://console.twilio.com/)
- **Paystack**: Register at [Paystack Dashboard](https://dashboard.paystack.com/)

### 4. Database Setup

**Option A: Supabase Dashboard (Recommended)**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration files in order:
   ```sql
   -- Execute these files in order:
   -- 1. migrations/supabase/20250906145518_database_schema.up.sql
   -- 2. migrations/supabase/20250909100000_create_candidates_view.up.sql
   -- 3. migrations/supabase/20250909135157_create_candidates_table.up.sql
   ```

**Option B: Command Line**
```bash
# Connect to Supabase database
psql "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# Run migrations in order
\i migrations/supabase/20250906145518_database_schema.up.sql
\i migrations/supabase/20250909100000_create_candidates_view.up.sql
\i migrations/supabase/20250909135157_create_candidates_table.up.sql
```

**Verify Setup:**
```sql
-- Check if tables were created (should include candidates table)
\dt

-- Verify candidates table structure
\d candidates

-- Verify RLS policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';
```

### 5. Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
automated_hiring_agent/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── parse/         # Resume analysis endpoint
│   │   │   ├── whatsapp/      # WhatsApp webhook
│   │   │   └── payments/      # Payment processing
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # User dashboard
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ResumeUploader.tsx # File upload component
│   │   ├── ErrorMessage.tsx   # Error handling
│   │   └── LoadingSkeleton.tsx# Loading states
│   ├── lib/                   # Utility functions
│   │   ├── utils.ts           # Text extraction
│   │   ├── supabase.ts        # Database client
│   │   └── queryClient.ts     # React Query setup
│   └── middleware.ts          # Rate limiting
├── database/
│   ├── schema.sql             # Database schema
│   └── seed.sql               # Sample data
├── __tests__/                 # Test files
├── doc/                       # Documentation
└── .amazonq/rules/            # Development rules
```

## 📖 API Documentation

### **Candidates API**
- `GET /api/candidates` - Fetch all candidates with pagination
- `POST /api/candidates` - Create new candidate (used internally by resume parser)

### **Resume Parsing API**
- `POST /api/parse` - Parse single resume PDF and extract candidate data
- `POST /api/parse/batch` - Parse multiple resumes (future enhancement)

### **WhatsApp API**
- `POST /api/whatsapp` - Send WhatsApp message to candidate
- `GET /api/whatsapp/status` - Check Twilio configuration status

### **Authentication API**
- `POST /api/auth/[...nextauth]` - NextAuth endpoints for authentication
- `GET /api/auth/callback` - Authentication callback handler

### **Example API Usage**

#### Send WhatsApp Message
```bash
curl -X POST http://localhost:3000/api/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+254724745666",
    "message": "Hello! We would like to schedule an interview with you."
  }'
```

#### Check WhatsApp Status
```bash
curl -X GET http://localhost:3000/api/whatsapp/status
```

#### Fetch Candidates
```bash
curl -X GET http://localhost:3000/api/candidates
```

## 🧪 Testing

### Test Suite Overview
Comprehensive testing covering authentication, resume processing, payments, and WhatsApp integration.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test suite
npm test auth.test.tsx
npm test resume.test.tsx
npm test payment.test.tsx
npm test whatsapp.test.tsx

# Generate coverage report
npm test -- --coverage
```

### Test Coverage Areas
- ✅ **Authentication**: Login/signup flows, session management
- ✅ **Resume Processing**: Nigerian format validation, file parsing
- ✅ **Payment Integration**: Paystack checkout, webhook verification
- ✅ **WhatsApp Integration**: Message sending, phone validation
- ✅ **API Endpoints**: Rate limiting, error handling
- ✅ **UI Components**: Loading states, form validation

### Manual Testing Checklist
```bash
# Test Nigerian resume formats
# Upload sample PDFs from Nigerian universities
# Verify phone number formats (+234 xxx xxx xxxx)
# Test Paystack payment flow with test cards
# Confirm WhatsApp message delivery
```

## 🚀 Deployment

### Production Deployment (Vercel)

**Prerequisites:**
- GitHub repository connected
- All environment variables configured
- Database migrations completed

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

**Vercel Dashboard Configuration:**
1. **Environment Variables**: Add all `.env.local` variables
2. **Build Settings**: 
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. **Domain**: Configure custom domain if needed

### Environment-Specific Setup

**Production Environment Variables:**
```env
# Use production API keys
OPENAI_API_KEY=sk-prod-...
PAYSTACK_PUBLIC_KEY=pk_live_...
PAYSTACK_SECRET_KEY=sk_live_...
TWILIO_ACCOUNT_SID=AC...
NEXTAUTH_URL=https://your-domain.com
```

**Database Production Setup:**
- Enable connection pooling in Supabase
- Configure Row Level Security policies
- Set up database backups
- Monitor query performance

### Performance Optimization
- ✅ Rate limiting: 100 requests/15 minutes
- ✅ Client-side caching with React Query
- ✅ Optimized OpenAI prompts (reduced token usage)
- ✅ Image optimization and lazy loading
- ✅ Bundle size optimization

### Monitoring & Analytics
```bash
# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]

# Monitor performance
# Use Vercel Analytics dashboard
```

## 📊 API Documentation

### Resume Analysis Endpoint
```typescript
POST /api/parse
Content-Type: application/json

{
  "jobDescription": "string (10-10000 chars)",
  "resume": "string (50-20000 chars)"
}

Response:
{
  "success": boolean,
  "data": {
    "score": number (1-100),
    "summary": "string",
    "pros": ["string"],
    "cons": ["string"]
  }
}
```

### WhatsApp Webhook
```typescript
POST /api/whatsapp
Content-Type: application/json

// Twilio webhook payload
// Handles incoming messages and media
```

### Payment Verification
```typescript
POST /api/payments/verify
Content-Type: application/json

{
  "reference": "string"
}
```

## 🔧 Configuration

### DeepSeek Optimization
- **Model**: deepseek-chat for cost efficiency and performance
- **Temperature**: 0.1 for consistent responses
- **Max Tokens**: 500 for concise analysis
- **Prompt Engineering**: HR-focused evaluation framework

### Rate Limiting
- **Window**: 15 minutes
- **Limit**: 100 requests per IP
- **Storage**: In-memory (use Redis for production scale)

### File Upload Limits
- **Types**: PDF, DOCX only
- **Size**: Maximum 5MB per file
- **Validation**: Client and server-side checking

## 🤝 Contributing

### Development Workflow
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes following project rules in `.amazonq/rules/`
3. Write tests for new functionality
4. Update documentation in `doc/`
5. Submit pull request with detailed description

### Code Standards
- **TypeScript**: Strict mode enabled with comprehensive type coverage
- **ESLint**: Airbnb configuration with Next.js rules
- **Prettier**: Consistent formatting across all files
- **Commit Messages**: Conventional commits format
  ```
  feat(auth): add magic link authentication
  fix(payment): resolve Paystack webhook validation
  test(resume): add Nigerian format validation tests
  docs(readme): update deployment instructions
  perf(api): optimize OpenAI token usage
  style(ui): add Framer Motion animations
  ```

### Development Workflow
1. **Branch Naming**: `feature/description`, `fix/issue`, `test/component`
2. **Pull Requests**: Detailed descriptions with testing notes
3. **Code Review**: All changes reviewed before merging
4. **Testing**: All tests must pass before deployment
5. **Documentation**: Update relevant docs with changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- **Feature Docs**: See `doc/` directory for detailed implementation guides
- **API Reference**: Check individual route files for endpoint documentation
- **Database Schema**: Review `database/schema.sql` for data structure

### Issues
- **Bug Reports**: Use GitHub Issues with detailed reproduction steps
- **Feature Requests**: Provide clear use case and expected behavior
- **Security Issues**: Email directly for responsible disclosure

### Community
- **Discussions**: GitHub Discussions for questions and ideas
- **Updates**: Follow repository for latest releases and features

---

**Built with ❤️ for the Nigerian tech ecosystem**

*Streamlining hiring processes with AI-powered intelligence and local market expertise.*