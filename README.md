# 🤖 AI-Driven Applicant Selection Tool

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com/)

An intelligent recruitment platform built specifically for the Nigerian job market, featuring AI-powered resume parsing, candidate ranking algorithms, and automated hiring workflows.

## 🎯 Built for PLP Nigeria Hackathon 2025

This project showcases advanced AI integration, modern web development practices, and scalable architecture designed to revolutionize hiring in Nigeria.

## ✨ Key Features

- 🧠 **AI-Powered Resume Analysis** - Advanced parsing with Nigerian context
- 📊 **Intelligent Candidate Ranking** - Multi-criteria scoring algorithm
- 💬 **WhatsApp Integration** - Automated candidate communication
- 💳 **Secure Payment Processing** - Subscription-based pricing tiers
- 🔒 **Enterprise Security** - Row-level security and data isolation
- 📱 **Responsive Design** - Mobile-first UI with dark mode support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI/DeepSeek API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/godsplan/automated-hiring-agent.git
cd automated-hiring-agent
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your API keys and database credentials
```

4. **Run database migrations**
```bash
npm run migrate
```

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3001` to see your application running!

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-3.5-turbo, DeepSeek API
- **Authentication**: Supabase Auth
- **Payments**: Paystack (Demo: KES, Production: NGN)
- **Communication**: Twilio WhatsApp API
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel

## 📊 Features Overview

### 🤖 AI-Powered Analysis
- Resume parsing with Nigerian context awareness
- Skills extraction and proficiency scoring
- Experience validation and ranking
- Education verification with local university recognition

### 📈 Intelligent Ranking
- Multi-criteria scoring algorithm (40% skills, 30% experience, 20% education, 10% cultural fit)
- Customizable ranking weights
- Batch processing capabilities
- Export functionality (CSV, PDF, Excel)

### 💬 WhatsApp Integration
- Automated candidate notifications
- Interview scheduling
- Status updates and feedback collection
- Multi-language support

### 🔒 Enterprise Security
- Row-level security (RLS)
- User data isolation
- Encrypted payment processing
- Rate limiting and input validation

## 🎪 Demo Mode (Hackathon)

Currently configured for demonstration with:
- **Currency**: KES (Kenyan Shilling)
- **Pricing**: KSh 1,250 ≈ ₦5,000 NGN equivalent
- **Payment**: Paystack Kenya account
- **Production Roadmap**: Nigerian business registration → NGN pricing

## 📝 License

MIT License - Copyright (c) 2025 Godsplan

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

## 🤝 Contributing

Built with ❤️ for the Nigerian tech ecosystem. Contributions welcome!

---

**© 2025 Godsplan - AI-Driven Applicant Selection Tool**
