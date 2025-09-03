# Automated Hiring Agent - Codebase Index

## Project Overview
AI-powered hiring assistant that analyzes resumes against job descriptions using OpenAI GPT-3.5-turbo.

## Tech Stack
- **Framework**: Next.js 14 (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI API (GPT-3.5-turbo)
- **File Processing**: pdf-parse, mammoth
- **Build Status**: ✅ Development Ready

## Directory Structure
```
/automated_hiring_agent/
├── doc/                     # Documentation
│   ├── CHANGELOG.md         # Project changelog
│   ├── fix-*.md            # Individual fix docs
├── public/                  # Static assets
│   └── favicon.ico         # Site icon
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/
│   │   │   ├── upload/      # File upload API
│   │   │   └── parse/       # Individual resume analysis API
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # React components
│   │   └── FileUploadForm.tsx
│   ├── lib/                 # Utility libraries
│   │   └── ai.ts           # OpenAI integration
│   └── types.ts            # TypeScript definitions
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies
└── tailwind.config.ts      # Tailwind configuration
```

## Core Components

### Types (`src/types.ts`)
- `JobDescription`: Job posting structure
- `Resume`: Resume file metadata and content
- `Candidate`: User profile with resumes
- `Feedback`: AI analysis results

### UI Components (`src/components/`)
- `FileUploadForm`: Main upload interface with job description and resume inputs

### Pages (`src/app/`)
- `page.tsx`: Home page with file upload form
- `layout.tsx`: Root layout with metadata

### API Routes (`src/app/api/`)
- `upload/route.ts`: Handles file uploads, parsing, and AI analysis
- `parse/route.ts`: Individual resume analysis with advanced validation

### Libraries (`src/lib/`)
- `ai.ts`: OpenAI integration for resume analysis

## Key Features
1. **File Upload**: Supports PDF, DOC, DOCX, TXT formats
2. **Document Parsing**: Extracts text from various file types
3. **AI Analysis**: Scores resumes (1-100) with pros/cons
4. **Batch Processing**: Analyzes multiple resumes simultaneously
5. **Individual Analysis**: Dedicated parse API with advanced validation
6. **Type Safety**: Comprehensive TypeScript integration with Zod validation
7. **Error Handling**: Enterprise-grade error management with custom error classes

## Dependencies
- `openai`: AI analysis
- `pdf-parse`: PDF text extraction
- `mammoth`: Word document processing
- `@types/pdf-parse`: TypeScript definitions
- `zod`: Schema validation and type safety

## Environment Variables
- `OPENAI_API_KEY`: Required for AI functionality