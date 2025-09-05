# Fix: ResumeUploader Dual Upload Zones

## Problem Description
The ResumeUploader component only had a single upload zone for resumes, missing the job description upload functionality required for proper candidate analysis.

## Root Cause
- Missing job description upload zone
- No separation between job description (single file) and resumes (multiple files)
- Inadequate file validation and error handling
- Poor user experience with unclear upload requirements

## Solution

### 1. Dual Upload Zones
- **Job Description Zone**: Single file upload (PDF/DOCX, max 5MB)
- **Resumes Zone**: Multiple file upload (PDF/DOCX, max 5MB each, up to 10 files)

### 2. Enhanced Validation
- File type validation (PDF/DOCX only)
- File size validation (5MB limit)
- Empty file detection
- Real-time error feedback with toast notifications

### 3. Improved UX
- Clear visual separation between upload zones
- Drag-and-drop functionality with visual feedback
- File preview with remove functionality
- Progress indicators and loading states

### 4. Production-Ready Features
- Real API integration with `/api/parse`
- Proper error handling and recovery
- Responsive design for all devices
- Accessibility compliance

## Code Changes

### Dual Upload Zones Structure
```tsx
{/* Job Description Upload */}
<Card>
  <CardHeader>
    <CardTitle className="flex items-center space-x-2">
      <FileText className="h-5 w-5" />
      <span>Job Description</span>
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div {...getJobDescriptionRootProps()}>
      {/* Upload area */}
    </div>
  </CardContent>
</Card>

{/* Resumes Upload */}
<Card>
  <CardHeader>
    <CardTitle className="flex items-center space-x-2">
      <Users className="h-5 w-5" />
      <span>Candidate Resumes</span>
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div {...getResumesRootProps()}>
      {/* Upload area */}
    </div>
  </CardContent>
</Card>
```

### File Validation
```tsx
const validateFile = useCallback((file: File): string | null => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return 'Only PDF and DOCX files are supported';
  }
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return `File size must be less than 5MB`;
  }
  
  return null;
}, []);
```

## Commit Reference
**Hash**: 5754689b
**Message**: `feat(ui/home): add dual upload zones to ResumeUploader with job description and resumes`

## Validation
- ✅ Job description single file upload
- ✅ Multiple resume file upload
- ✅ File validation (type, size)
- ✅ Drag-and-drop functionality
- ✅ Real API integration
- ✅ Responsive design