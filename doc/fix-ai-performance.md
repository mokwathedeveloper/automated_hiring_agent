# Fix: AI Library Performance Issues

## Problem Description
Amazon Q Security Scan flagged: "Performance inefficiencies detected in code. Using `Date.now()` for ID generation creates potential collisions when multiple resumes are processed simultaneously, as all IDs share the same timestamp base."

Lines 37-38 used timestamp-based ID generation that could cause collisions.

## Root Cause Analysis
Using `Date.now()` for ID generation in concurrent processing scenarios can create duplicate IDs when:
- Multiple resumes are processed at the same time
- Operations complete within the same millisecond
- The same timestamp is used as the base for multiple IDs

## Solution Applied
Replaced timestamp-based ID generation with cryptographically secure UUIDs:

```typescript
import { randomUUID } from 'crypto';

// Before
return responses.map((response, index) => ({
  id: `${Date.now()}-${index}`,
  candidateId: `candidate-${index}`,
  // ...
}));

// After
return responses.map((response, index) => ({
  id: randomUUID(),
  candidateId: `candidate-${randomUUID()}`,
  // ...
}));
```

This ensures unique IDs even in high-concurrency scenarios and eliminates collision risks.

## Commit Reference
- **Hash**: 98046b4
- **Message**: perf(lib): address performance inefficiencies in ai.ts