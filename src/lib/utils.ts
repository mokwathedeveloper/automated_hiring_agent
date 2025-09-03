// src/lib/utils.ts

import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Extract text from PDF buffer using pdf-parse
 */
async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract text from DOCX buffer using mammoth
 */
async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new Error(`DOCX parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract text from file buffer based on MIME type
 * Supports PDF and DOCX files only
 */
export async function extractTextFromFile(buffer: Buffer, mimeType: string): Promise<string> {
  try {
    switch (mimeType) {
      case 'application/pdf':
        return await extractTextFromPdf(buffer);
      
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return await extractTextFromDocx(buffer);
      
      default:
        throw new Error(`Unsupported file type: ${mimeType}. Only PDF and DOCX files are supported.`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Text extraction failed due to unknown error');
  }
}