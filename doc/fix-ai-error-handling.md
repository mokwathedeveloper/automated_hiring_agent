# Fix: AI Library Error Handling

## Problem Description
Amazon Q Security Scan flagged multiple error handling issues in `src/lib/ai.ts`:

1. Lines 6-7: "Missing validation for `process.env.OPENAI_API_KEY` - if undefined, OpenAI client will fail at runtime with unclear error messages."
2. Lines 32-33: "`JSON.parse(content)` can throw SyntaxError if OpenAI returns malformed JSON, but this error is not caught, potentially crashing the entire batch processing."

## Root Cause Analysis
1. No validation for required environment variable before creating OpenAI client
2. Unhandled JSON parsing that could throw SyntaxError on malformed responses

## Solution Applied

1. **API Key Validation**:
```typescript
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}
```

2. **JSON Parse Error Handling**:
```typescript
try {
  return JSON.parse(content);
} catch (parseError) {
  throw new Error(`Failed to parse OpenAI response as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
}
```

These changes provide clear error messages and prevent runtime crashes from malformed JSON responses.

## Commit Reference
- **Hash**: aa8eab2
- **Message**: fix(lib): strengthen error handling in ai.ts