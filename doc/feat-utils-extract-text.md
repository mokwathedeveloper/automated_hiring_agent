# Feature: File Text Extraction Utility

## Problem Description
The application needed a robust, type-safe utility function to extract text content from uploaded resume files. The system required support for PDF and DOCX formats only, with comprehensive error handling for unsupported file types and parsing failures.

## Root Cause Analysis
The existing codebase lacked a centralized text extraction utility, which would be essential for:
- Processing uploaded resume files in various formats
- Providing consistent error handling across file parsing operations
- Ensuring type safety and reliability in text extraction workflows
- Supporting the core resume analysis functionality

## Applied Solution
Implemented `src/lib/utils.ts` with the following components:

### Core Function
```typescript
export async function extractTextFromFile(buffer: Buffer, mimeType: string): Promise<string>
```

### Helper Functions
- `extractTextFromPdf(buffer: Buffer)` - Uses pdf-parse library for PDF processing
- `extractTextFromDocx(buffer: Buffer)` - Uses mammoth library for DOCX processing

### Key Features
- **Type Safety**: Full TypeScript support with proper error typing
- **Error Handling**: Comprehensive try/catch blocks with descriptive error messages
- **Format Support**: PDF and DOCX file formats only
- **MIME Type Validation**: Throws clear errors for unsupported file types
- **Robust Parsing**: Handles parsing failures gracefully with detailed error context

### Error Handling Strategy
- Validates MIME types before processing
- Wraps library calls in try/catch blocks
- Provides specific error messages for different failure scenarios
- Maintains error chain for debugging purposes

## Commit Reference
**Hash**: `d009393`
**Message**: `feat(utils): implement extractTextFromFile — adds robust, type-safe text extraction for PDF/DOCX files`

## Technical Benefits
- Centralized text extraction logic
- Consistent error handling across the application
- Type-safe implementation with proper TypeScript support
- Clear separation of concerns with dedicated helper functions
- Extensible architecture for future file format support