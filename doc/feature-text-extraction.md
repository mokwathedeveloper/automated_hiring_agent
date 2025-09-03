# Text Extraction Utility Functions

## Feature Description
Comprehensive text extraction library providing specialized functions for PDF and DOCX document processing with robust error handling, metadata collection, and batch processing capabilities.

## Design Rationale
- **Modularity**: Separate functions for each file type enable targeted optimization and maintenance
- **Error Isolation**: Individual file processing prevents batch failures from single file errors
- **Metadata Collection**: Comprehensive tracking for audit trails and debugging purposes
- **Type Safety**: Full TypeScript integration with proper interfaces and error handling
- **Scalability**: Batch processing capabilities for handling multiple documents efficiently

## Applied Solution

### Core Extraction Functions
```typescript
export async function extractFromPDF(file: File): Promise<ExtractionResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdf(buffer);
    
    return {
      text: data.text.trim(),
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        fileType: 'PDF',
        extractedAt: new Date(),
      },
    };
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function extractFromDOCX(file: File): Promise<ExtractionResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { value } = await mammoth.extractRawText({ buffer });
    
    return {
      text: value.trim(),
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        fileType: 'DOCX',
        extractedAt: new Date(),
      },
    };
  } catch (error) {
    throw new Error(`DOCX extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
```

### Universal Extraction Interface
```typescript
export async function extractText(file: File): Promise<ExtractionResult> {
  const mimeType = file.type;
  
  switch (mimeType) {
    case 'application/pdf':
      return extractFromPDF(file);
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return extractFromDOCX(file);
    default:
      throw new Error(`Unsupported file type: ${mimeType}`);
  }
}
```

### Batch Processing with Error Handling
```typescript
export async function extractMultipleTexts(files: File[]): Promise<{
  successful: ExtractionResult[];
  failed: ExtractionError[];
}> {
  const successful: ExtractionResult[] = [];
  const failed: ExtractionError[] = [];
  
  for (const file of files) {
    try {
      const result = await extractText(file);
      successful.push(result);
    } catch (error) {
      failed.push({
        fileName: file.name,
        error: error instanceof Error ? error.message : 'Unknown error',
        fileType: file.type,
      });
    }
  }
  
  return { successful, failed };
}
```

## Key Features
- **Multi-Format Support**: Dedicated handlers for PDF and DOCX files
- **Automatic Type Detection**: MIME type-based routing to appropriate extraction function
- **Comprehensive Metadata**: File name, size, type, and extraction timestamp tracking
- **Error Isolation**: Individual file failures don't affect batch processing
- **Memory Efficient**: Proper buffer handling and cleanup
- **TypeScript Integration**: Full type safety with proper interfaces

## Technical Implementation
- **PDF Processing**: Uses pdf-parse library for reliable text extraction
- **DOCX Processing**: Uses mammoth library for Microsoft Word document handling
- **Buffer Management**: Proper ArrayBuffer to Buffer conversion for library compatibility
- **Error Propagation**: Detailed error messages with context information
- **Async/Await**: Modern asynchronous processing for better performance

## Interface Definitions
```typescript
export interface ExtractionResult {
  text: string;
  metadata: {
    fileName: string;
    fileSize: number;
    fileType: string;
    extractedAt: Date;
  };
}

export interface ExtractionError {
  fileName: string;
  error: string;
  fileType: string;
}
```

## Usage Examples
```typescript
// Single file extraction
const result = await extractText(pdfFile);
console.log(result.text, result.metadata);

// Batch processing
const { successful, failed } = await extractMultipleTexts(fileArray);
console.log(`Processed: ${successful.length}, Failed: ${failed.length}`);
```

## Commit Reference
- **Hash**: `322bc95`
- **Message**: `feat(utils/extract): add PDF/DOCX text extraction utility functions`
- **Branch**: `feature/text-extraction`