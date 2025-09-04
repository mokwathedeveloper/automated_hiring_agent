# 🤖 Automated Hiring Agent

An AI-powered resume analysis platform designed specifically for the Nigerian job market. Streamline your hiring process with intelligent candidate evaluation, WhatsApp integration, and comprehensive analytics.

## ✨ Features

### 🎯 **Core Functionality**
- **AI-Powered Resume Analysis**: Advanced OpenAI integration with HR-focused prompting
- **Nigerian Market Optimization**: Specialized for local companies, universities, and formats
- **Drag-and-Drop Upload**: Modern file upload with PDF/DOCX support
- **Real-time Processing**: Instant candidate scoring and detailed feedback

### 🔐 **Authentication & Security**
- **Magic Link Authentication**: Passwordless login via Supabase Auth
- **Row Level Security**: Database-level access control
- **Rate Limiting**: API protection against abuse (100 requests/15 minutes)
- **File Validation**: Strict type and size checking (PDF/DOCX, max 5MB)

### 💬 **WhatsApp Integration**
- **Twilio WhatsApp API**: Direct candidate communication
- **Media Handling**: Resume upload via WhatsApp
- **Automated Responses**: Intelligent conversation flow
- **Session Management**: Persistent chat state tracking

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

### **Backend**
- **Next.js API Routes**: Serverless functions
- **OpenAI GPT-3.5**: AI-powered analysis
- **Zod**: Runtime type validation
- **Middleware**: Rate limiting and security

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
- OpenAI API key
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
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

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
- **OpenAI**: Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- **Supabase**: Create project at [Supabase Dashboard](https://supabase.com/dashboard)
- **NextAuth**: Generate secret with `openssl rand -base64 32`
- **Twilio**: Sign up at [Twilio Console](https://console.twilio.com/)
- **Paystack**: Register at [Paystack Dashboard](https://dashboard.paystack.com/)

### 4. Database Setup

**Option A: Supabase Dashboard (Recommended)**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and execute the contents of `database/schema.sql`

**Option B: Command Line**
```bash
# Connect to Supabase database
psql "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# Run schema
\i database/schema.sql
```

**Verify Setup:**
```sql
-- Check if tables were created
\dt

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

### OpenAI Optimization
- **Model**: GPT-3.5-turbo for cost efficiency
- **Temperature**: 0.2 for consistent responses
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