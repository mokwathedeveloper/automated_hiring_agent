# Fix: API Route Readability and Maintainability

## Problem Description
Amazon Q Security Scan flagged: "Readability and maintainability issues detected. The hardcoded MIME type string reduces readability and maintainability."

The hardcoded MIME type string `'application/vnd.openxmlformats-officedocument.wordprocessingml.document'` in lines 23-24 reduced code readability.

## Root Cause Analysis
Long, hardcoded MIME type strings scattered throughout the code make it difficult to read and maintain. Changes to supported file types would require updating multiple locations.

## Solution Applied
Extracted MIME types into constants at the top of the file:

```typescript
const MIME_TYPES = {
  PDF: 'application/pdf',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
} as const;
```

Then replaced hardcoded strings with readable constants:
```typescript
if (file.type === MIME_TYPES.PDF) {
  // PDF processing
} else if (file.type === MIME_TYPES.DOCX) {
  // DOCX processing
}
```

## Commit Reference
- **Hash**: a981972
- **Message**: refactor(api): enhance readability and maintainability in route.ts