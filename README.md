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
Create `.env.local` file:
```env
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Paystack Configuration
PAYSTACK_PUBLIC_KEY=pk_test_your-paystack-public-key
PAYSTACK_SECRET_KEY=sk_test_your-paystack-secret-key
```

### 4. Database Setup
```bash
# Run database migrations
psql -h your-supabase-host -U postgres -d postgres -f database/schema.sql
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

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test ResumeUploader.test.tsx
```

### Test Coverage
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API endpoint validation
- **Nigerian Resume Testing**: Local format compatibility

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

2. **Environment Variables**
   Add all `.env.local` variables to Vercel dashboard

3. **Database Configuration**
   - Ensure Supabase project is production-ready
   - Configure connection pooling for high traffic

### Manual Deployment

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
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
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Consistent formatting
- **Commit Messages**: Conventional commits format

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