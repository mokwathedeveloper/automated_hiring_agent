# UI Component - File Validation Feature

## Feature Description
Implemented comprehensive client-side file validation ensuring only PDF and DOCX files under 5MB are accepted for upload, with clear error messaging for invalid files.

## Design Rationale
- **Security**: Prevent potentially harmful file types from being uploaded
- **Performance**: Limit file sizes to ensure reasonable processing times and memory usage
- **User Experience**: Immediate feedback prevents wasted time uploading invalid files
- **Resource Management**: 5MB limit balances functionality with server resource constraints

## Applied Solution

### File Validation Function
```typescript
const validateFile = useCallback((file: File): string | null => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  if (!allowedTypes.includes(file.type)) {
    return 'Only PDF and DOCX files are allowed';
  }
  
  if (file.size > maxSize) {
    return `File size must be under 5MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
  }
  
  return null;
}, []);
```

### Validation Integration
```typescript
// Drag-and-drop validation
const handleDrop = useCallback((e: React.DragEvent, type: 'job' | 'resume') => {
  e.preventDefault();
  setIsDragOver(false);
  setValidationError(null);
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    if (type === 'job') {
      const error = validateFile(files[0]);
      if (error) {
        setValidationError(error);
        return;
      }
      setJobDescription(files[0]);
    }
    // Similar validation for resumes...
  }
}, [validateFile]);
```

### Error Display
```jsx
{validationError && (
  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
    <p className="text-sm text-red-600">{validationError}</p>
  </div>
)}
```

## Key Features
- **File Type Restriction**: Only PDF and DOCX files accepted
- **Size Limitation**: Maximum 5MB per file with precise size reporting
- **Real-time Validation**: Immediate feedback on both drag-drop and file selection
- **Clear Error Messages**: Specific error descriptions with file details
- **Multiple File Support**: Validates each resume file individually
- **Visual Error Display**: Prominent red-bordered error notifications

## Validation Rules
- **Allowed MIME Types**: 
  - `application/pdf` (PDF files)
  - `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (DOCX files)
- **Maximum File Size**: 5MB (5,242,880 bytes)
- **Error Handling**: Prevents file selection and displays specific error messages

## Technical Implementation
- **Client-side Validation**: Immediate feedback without server round-trips
- **MIME Type Checking**: Reliable file type detection using browser APIs
- **File Size Calculation**: Precise size reporting in MB with decimal precision
- **State Management**: Proper error state clearing on new file selections
- **TypeScript Integration**: Full type safety for validation functions

## Commit Reference
- **Hash**: `0bf1078`
- **Message**: `feat(ui/upload): implement file validation (PDF/DOCX only, max 5MB)`
- **Branch**: `feature/ui-file-validation`