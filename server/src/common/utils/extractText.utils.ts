import * as mammoth from 'mammoth';
import * as xlsx from 'xlsx';

/**
 * Extracts text from a document
 * Supported file types:
 * - PDF
 * - DOCX
 * - XLSX
 * - CSV
 * - TEXT
 * @param file - The document to extract text from
 * @returns The text from the document
 */
export async function extractTextFromDocument(file: Express.Multer.File) {
  switch (file.mimetype) {
    case 'application/pdf': {
      const pdfData = await (await import('pdf-parse'))(file.buffer);
      return pdfData.text;
    }
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return result.value;
    }

    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
      const workbook = xlsx.read(file.buffer);
      return workbook.SheetNames.map((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        return `Sheet: ${sheetName}\n${xlsx.utils.sheet_to_csv(sheet)}`;
      }).join('\n\n');
    }

    case 'text/csv':
      return file.buffer.toString('utf-8');

    default:
      try {
        return file.buffer.toString('utf-8');
      } catch {
        throw new Error(`Unsupported file type: ${file.mimetype}`);
      }
  }
}
