// src/lib/textExtraction.ts

import pdf from 'pdf-parse';
import mammoth from 'mammoth';

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

/**
 * Extract text from PDF files
 */
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

/**
 * Extract text from DOCX files
 */
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

/**
 * Universal text extraction function that handles both PDF and DOCX
 */
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

/**
 * Extract text from multiple files with error handling
 */
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