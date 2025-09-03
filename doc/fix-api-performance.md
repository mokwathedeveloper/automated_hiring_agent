# Fix: API Route Performance Issues

## Problem Description
Amazon Q Security Scan flagged: "Performance inefficiencies detected in code. Sequential file parsing with `Promise.all` processes all resume files simultaneously without memory limits, potentially causing memory exhaustion with large files or many resumes."

Lines 32-33 used `Promise.all` to process all files simultaneously without memory or size constraints.

## Root Cause Analysis
Processing all resume files simultaneously with `Promise.all(resumeFiles.map(parseFile))` could cause memory exhaustion when handling:
- Large files (no size validation)
- Many files simultaneously (no concurrency limits)

## Solution Applied
Implemented batch processing with file size validation:

1. **File Size Validation**:
```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

if (file.size > MAX_FILE_SIZE) {
  throw new Error(`File ${file.name} exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
}
```

2. **Batch Processing**:
```typescript
const MAX_CONCURRENT_FILES = 5;

const processBatch = async (files: File[]): Promise<string[]> => {
  const results: string[] = [];
  for (let i = 0; i < files.length; i += MAX_CONCURRENT_FILES) {
    const batch = files.slice(i, i + MAX_CONCURRENT_FILES);
    const batchResults = await Promise.all(batch.map(parseFile));
    results.push(...batchResults);
  }
  return results;
};
```

This prevents memory issues by processing files in smaller chunks with size limits.

## Commit Reference
- **Hash**: bbfe551
- **Message**: perf(api): optimize upload route for better performance