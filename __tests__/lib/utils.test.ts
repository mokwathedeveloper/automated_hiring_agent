// __tests__/lib/utils.test.ts

import { extractTextFromFile } from '@/lib/utils';

describe('extractTextFromFile', () => {
  it('should reject unsupported file types', async () => {
    const buffer = Buffer.from('test content');
    
    await expect(extractTextFromFile(buffer, 'text/plain'))
      .rejects
      .toThrow('Unsupported file type: text/plain. Only PDF and DOCX files are supported.');
  });

  it('should handle PDF MIME type', async () => {
    const buffer = Buffer.from('test content');
    
    // This will fail due to invalid PDF, but tests the flow
    await expect(extractTextFromFile(buffer, 'application/pdf'))
      .rejects
      .toThrow('PDF parsing failed');
  });

  it('should handle DOCX MIME type', async () => {
    const buffer = Buffer.from('test content');
    
    // This will fail due to invalid DOCX, but tests the flow
    await expect(extractTextFromFile(buffer, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'))
      .rejects
      .toThrow('DOCX parsing failed');
  });
});