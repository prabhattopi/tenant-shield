import { ExtractedPage } from './pdfParser.service.js';

export interface SemanticChunk {
  chunkId: string;
  sectionTitle: string;
  startPage: number;
  endPage: number;
  text: string;
  estimatedTokens: number;
}

export class SemanticChunkerService {
  private static SECTION_HEADER_PATTERNS = [
    /(?:ARTICLE|SECTION|CLAUSE)\s+([0-9IVXLCDM\.]+)\s*[:\-\.]?\s*([A-Za-z\s,\/]+)/i,
    /^\s*([0-9]{1,2}\.)\s+([A-Za-z\s,\/]{3,50})/m,
    /\b(SECURITY DEPOSIT|RENT AND CHARGES|MAINTENANCE AND REPAIRS|LANDLORD ENTRY|INDEMNIFICATION|DEFAULT|ATTORNEY'?S FEES|TERMINATION|ADDENDUM|EXHIBIT [A-Z]|RULES AND REGULATIONS)\b/i,
  ];

  /**
   * Chunks page-by-page text using legal section boundary detection & sliding window overlap.
   */
  public static chunkDocument(pages: ExtractedPage[], maxWordsPerChunk = 650, overlapWords = 80): SemanticChunk[] {
    const chunks: SemanticChunk[] = [];
    let currentChunkWords: string[] = [];
    let currentTitle = 'General Provisions';
    let chunkStartPage = pages[0]?.pageNumber || 1;
    let chunkIndex = 1;

    for (const page of pages) {
      const lines = page.text.split('\n');

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Check if this line signals a new section header
        const detectedHeader = this.detectSectionHeader(trimmed);
        if (detectedHeader) {
          // If we have enough words in current buffer, commit current chunk
          if (currentChunkWords.length >= 200) {
            chunks.push({
              chunkId: `chunk_${chunkIndex++}`,
              sectionTitle: currentTitle,
              startPage: chunkStartPage,
              endPage: page.pageNumber,
              text: currentChunkWords.join(' '),
              estimatedTokens: Math.round(currentChunkWords.length * 1.35),
            });

            // Slide window with overlap
            currentChunkWords = currentChunkWords.slice(-overlapWords);
            chunkStartPage = page.pageNumber;
          }
          currentTitle = detectedHeader;
        }

        const lineWords = trimmed.split(/\s+/);
        currentChunkWords.push(...lineWords);

        // If buffer exceeds max word limit, flush chunk
        if (currentChunkWords.length >= maxWordsPerChunk) {
          chunks.push({
            chunkId: `chunk_${chunkIndex++}`,
            sectionTitle: currentTitle,
            startPage: chunkStartPage,
            endPage: page.pageNumber,
            text: currentChunkWords.join(' '),
            estimatedTokens: Math.round(currentChunkWords.length * 1.35),
          });

          // Slide window with overlap
          currentChunkWords = currentChunkWords.slice(-overlapWords);
          chunkStartPage = page.pageNumber;
        }
      }
    }

    // Flush any remaining words in buffer
    if (currentChunkWords.length > 0) {
      chunks.push({
        chunkId: `chunk_${chunkIndex++}`,
        sectionTitle: currentTitle,
        startPage: chunkStartPage,
        endPage: pages[pages.length - 1]?.pageNumber || chunkStartPage,
        text: currentChunkWords.join(' '),
        estimatedTokens: Math.round(currentChunkWords.length * 1.35),
      });
    }

    return chunks;
  }

  private static detectSectionHeader(line: string): string | null {
    if (line.length > 80) return null; // Section headers are usually succinct

    for (const pattern of this.SECTION_HEADER_PATTERNS) {
      const match = line.match(pattern);
      if (match) {
        return match[0].trim().replace(/[:\.\-]+$/, '');
      }
    }

    return null;
  }
}
