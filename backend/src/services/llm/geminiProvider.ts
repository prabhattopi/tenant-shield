import { GoogleGenerativeAI } from '@google/generative-ai';
import { ILLMProvider, LeaseAnalysisResult, DemandLetterContext } from './llmProvider.interface.js';
import { SemanticChunk } from '../semanticChunker.service.js';

export class GeminiLLMProvider implements ILLMProvider {
  public name = 'Google Gemini (1.5 Flash / 2.0)';
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor(apiKey: string, modelName = 'gemini-1.5-flash') {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
  }

  public async analyzeLease(
    chunks: SemanticChunk[],
    jurisdiction: { country: string; stateRegion: string }
  ): Promise<LeaseAnalysisResult> {
    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const combinedChunks = chunks
      .slice(0, 15) // Process up to 15 key semantic chunks in batch
      .map(c => `[${c.sectionTitle} - Page ${c.startPage}-${c.endPage}]:\n${c.text}`)
      .join('\n\n--- CHUNK BREAK ---\n\n');

    const prompt = `
You are an expert tenancy law attorney specialized in statutory tenant rights and contract risk auditing.
Analyze the following residential lease agreement text from Jurisdiction: ${jurisdiction.country} - ${jurisdiction.stateRegion}.

Key statutory rules to check:
1. Security Deposits: Are non-refundable deposits declared? (Illegal under Cal. Civ. Code § 1950.5(m), NY HSTPA, etc.). Are deductions allowed for ordinary wear & tear?
2. Landlord Entry: Does the lease permit unannounced entry without at least 24-48 hours notice?
3. Repair Waivers: Does the landlord disclaim habitability duties (heating, plumbing, leaks) or force tenant to pay structural repairs?
4. Excessive Fees: Are late fees arbitrary/punitive ($100+)? Non-refundable re-letting or turnover fees?
5. Indemnification: Does tenant hold landlord harmless for landlord's own gross negligence?

Return a STRICT JSON object conforming to this schema:
{
  "overallRiskScore": number (0 is safe, 100 is predatory),
  "executiveSummary": string,
  "financialExposureSummary": {
    "totalEstimatedRiskUSD": number,
    "illegalFeesDetectedUSD": number,
    "depositVulnerabilityUSD": number
  },
  "clauses": [
    {
      "clauseId": string,
      "sectionTitle": string,
      "pageNumber": number,
      "rawText": string (exact or near quote from text),
      "severity": "CRITICAL_ILLEGAL" | "HIGH_RISK" | "MODERATE_UNUSUAL" | "FAIR",
      "category": "DEPOSIT_FORFEITURE" | "ENTRY_RIGHTS" | "REPAIR_LIABILITY" | "EXCESSIVE_FEES" | "ARBITRATION_TRAP" | "OTHER",
      "explanation": string,
      "statutoryCitation": string (e.g. California Civil Code § 1950.5),
      "suggestedCounterClause": string,
      "potentialFinancialLiabilityUSD": number
    }
  ]
}

LEASE TEXT TO ANALYZE:
${combinedChunks}
`;

    try {
      const response = await model.generateContent(prompt);
      const text = response.response.text();
      const parsed = JSON.parse(text) as LeaseAnalysisResult;
      return parsed;
    } catch (err: any) {
      console.error('❌ Gemini analysis failed:', err.message);
      throw err;
    }
  }

  public async generateDemandNotice(context: DemandLetterContext): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: this.modelName });

    const prompt = `
Draft a formal, certified statutory Security Deposit Demand Notice from Tenant to Landlord.
Jurisdiction: ${context.jurisdictionState}
Tenant: ${context.tenantName}
Landlord: ${context.landlordName} (${context.landlordAddress})
Rental Address: ${context.rentalAddress}
Lease End Date: ${context.leaseEndDate}
Total Deposit Paid: $${context.totalDepositPaid}
Unlawfully Withheld: $${context.unlawfullyWithheldAmount}

Disputed Deductions:
${context.disputedDeductions.map(d => `- ${d.item}: $${d.amount} (Reason: ${d.reason})`).join('\n')}

Instructions:
1. Cite statutory tenancy codes for ${context.jurisdictionState} (e.g., California Civil Code § 1950.5 or relevant state code).
2. Note the statutory deadline for itemized statements and deposit return (e.g., 21 days).
3. Warn of bad-faith retention statutory penalty damages (up to twice the amount of the security deposit).
4. Demand immediate return within 10 business days before filing in Small Claims Court.
5. Format in clean, formal legal Markdown.
`;

    const res = await model.generateContent(prompt);
    return res.response.text();
  }
}
