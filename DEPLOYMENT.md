# 🚀 Deployment Guide

This guide covers deploying the HiringAgent application to various platforms.

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase project set up
- Twilio account (optional, for WhatsApp)
- Git repository access

## 🔧 Environment Setup

### Required Environment Variables

Create a `.env` file with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Twilio WhatsApp Configuration (Optional)
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.com
```

### Environment Variable Sources

#### **Supabase Variables**
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to Settings → API
4. Copy the Project URL and anon public key
5. Go to Settings → API → Service Role Key (keep this secret!)

#### **Twilio Variables**
1. Go to [Twilio Console](https://console.twilio.com/)
2. Copy Account SID and Auth Token from dashboard
3. For WhatsApp number, use sandbox number `+14155238886` for testing

#### **NextAuth Variables**
1. Generate a secret: `openssl rand -base64 32`
2. Set NEXTAUTH_URL to your production domain

## 🌐 Vercel Deployment (Recommended)

### Step 1: Prepare Repository
```bash
# Ensure your code is committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure environment variables in Vercel dashboard
5. Deploy

### Step 3: Configure Environment Variables in Vercel
1. Go to Project Settings → Environment Variables
2. Add all required environment variables
3. Redeploy if needed

### Vercel Configuration File
Create `vercel.json` in your project root:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NEXTAUTH_URL": "https://your-domain.vercel.app"
  }
}
```

## 🐳 Docker Deployment

### Dockerfile
Create a `Dockerfile` in your project root:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose
Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
      - TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
      - TWILIO_WHATSAPP_NUMBER=${TWILIO_WHATSAPP_NUMBER}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    env_file:
      - .env
```

### Deploy with Docker
```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d
```

## ☁️ AWS Deployment

### Using AWS Amplify
1. Go to AWS Amplify Console
2. Connect your Git repository
3. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
4. Add environment variables in Amplify console
5. Deploy

### Using EC2
1. Launch an EC2 instance (Ubuntu 20.04+)
2. Install Node.js and npm
3. Clone your repository
4. Install dependencies and build
5. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start npm --name "hiring-agent" -- start
   pm2 startup
   pm2 save
   ```

## 🔄 Database Migration

### Supabase Setup
1. Create a new Supabase project
2. Run the migration scripts in SQL Editor:
   ```sql
   -- Run fix_candidates_table.sql
   -- Run verify_candidates_table.sql
   ```
3. Set up Row Level Security policies
4. Configure authentication providers

### Migration Scripts
```bash
# Run database migrations
psql -h your-supabase-host -U postgres -d postgres -f fix_candidates_table.sql
psql -h your-supabase-host -U postgres -d postgres -f verify_candidates_table.sql
```

## 🔒 Security Configuration

### Production Security Checklist
- [ ] Environment variables are secure and not exposed
- [ ] NEXTAUTH_SECRET is a strong, random string
- [ ] Supabase RLS policies are properly configured
- [ ] API rate limiting is enabled
- [ ] HTTPS is enforced
- [ ] Error messages don't expose sensitive information

### Supabase Security
1. Enable Row Level Security on all tables
2. Configure proper authentication policies
3. Set up proper CORS settings
4. Use service role key only on server-side

## 📊 Monitoring & Analytics

### Error Monitoring
Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Vercel Analytics for performance monitoring

### Performance Monitoring
- Monitor Core Web Vitals
- Set up alerts for API response times
- Monitor database query performance

## 🧪 Testing Deployment

### Pre-deployment Checklist
```bash
# Build test
npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Test API endpoints
curl -X GET https://your-domain.com/api/candidates
curl -X GET https://your-domain.com/api/whatsapp/status
```

### Post-deployment Testing
1. Test authentication flow
2. Upload and parse a resume
3. Test WhatsApp integration (if configured)
4. Verify responsive design on mobile
5. Test error handling scenarios

## 🔄 CI/CD Pipeline

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🆘 Troubleshooting

### Common Issues

#### Build Failures
- Check Node.js version compatibility
- Verify all environment variables are set
- Check for TypeScript errors

#### Authentication Issues
- Verify NEXTAUTH_URL matches your domain
- Check Supabase configuration
- Verify callback URLs are correct

#### WhatsApp Issues
- Check Twilio credentials
- Verify WhatsApp number configuration
- Test with sandbox first

#### Database Issues
- Verify Supabase connection
- Check RLS policies
- Ensure service role key is correct

### Getting Help
1. Check the [README.md](./README.md) for setup instructions
2. Review [WHATSAPP_SETUP.md](./WHATSAPP_SETUP.md) for WhatsApp configuration
3. Check application logs for specific errors
4. Verify all environment variables are correctly set

---

**For additional support, please check the project documentation or create an issue in the repository.**
