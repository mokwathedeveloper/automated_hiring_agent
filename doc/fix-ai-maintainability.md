# Fix: AI Library Maintainability

## Problem Description
Amazon Q Security Scan flagged: "Readability and maintainability issues detected. Hardcoded values `'job-1'` and `'gpt-3.5-turbo'` reduce flexibility and make the code harder to maintain when requirements change."

Lines 24-40 contained hardcoded values that reduced maintainability.

## Root Cause Analysis
Hardcoded values scattered throughout the code make it difficult to:
- Update AI model versions
- Change default job IDs
- Maintain consistency across the application

## Solution Applied
Extracted hardcoded values into a configuration object:

```typescript
const AI_CONFIG = {
  MODEL: 'gpt-3.5-turbo',
  DEFAULT_JOB_ID: 'job-1',
} as const;
```

Then replaced hardcoded values with constants:
```typescript
// Model configuration
const completion = await openai.chat.completions.create({
  model: AI_CONFIG.MODEL,
  messages: [{ role: 'user', content: prompt }],
});

// Job ID assignment
return responses.map((response, index) => ({
  id: `${Date.now()}-${index}`,
  candidateId: `candidate-${index}`,
  jobDescriptionId: AI_CONFIG.DEFAULT_JOB_ID,
  ...response,
}));
```

This improves maintainability by centralizing configuration values.

## Commit Reference
- **Hash**: 94f8cc1
- **Message**: refactor(lib): improve maintainability of AI logic