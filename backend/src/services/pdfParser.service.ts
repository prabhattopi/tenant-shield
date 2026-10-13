import crypto from 'crypto';
import pdfParse from 'pdf-parse';

export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export interface PDFParseResult {
  fileHash: string;
  pageCount: number;
  rawText: string;
  pages: ExtractedPage[];
  fileSizeBytes: number;
}

export class PDFParserService {
  /**
   * Safely parses a PDF buffer into structured page texts and computes SHA-256 hash.
   */
  public static async parse(buffer: Buffer): Promise<PDFParseResult> {
    const fileHash = crypto.createHash('sha256').update(buffer).digest('hex');
    const fileSizeBytes = buffer.length;

    const pages: ExtractedPage[] = [];

    // Custom page render handler to capture page numbers
    const renderPage = (pageData: any) => {
      return pageData.getTextContent().then((textContent: any) => {
        let lastY: number | null = null;
        let pageText = '';

        for (const item of textContent.items) {
          if (lastY === item.transform[5] || lastY === null) {
            pageText += item.str + ' ';
          } else {
            pageText += '\n' + item.str + ' ';
          }
          lastY = item.transform[5];
        }

        const pageNumber = pageData.pageIndex + 1;
        pages.push({
          pageNumber,
          text: pageText.trim(),
        });

        return pageText;
      });
    };

    try {
      const parsed = await pdfParse(buffer, {
        pagerender: renderPage,
      });

      // If custom pagerender didn't populate pages (some single page or format quirks), fallback
      if (pages.length === 0) {
        pages.push({
          pageNumber: 1,
          text: parsed.text.trim(),
        });
      }

      // Sort pages sequentially
      pages.sort((a, b) => a.pageNumber - b.pageNumber);

      return {
        fileHash,
        pageCount: parsed.numpages || pages.length,
        rawText: parsed.text.trim(),
        pages,
        fileSizeBytes,
      };
    } catch (err: any) {
      console.warn('⚠️ Standard pdf-parse error, attempting plain buffer text fallback:', err.message);
      // Fallback for plain text or simulation buffers
      const text = buffer.toString('utf-8');
      return {
        fileHash,
        pageCount: 1,
        rawText: text,
        pages: [{ pageNumber: 1, text }],
        fileSizeBytes,
      };
    }
  }
}
