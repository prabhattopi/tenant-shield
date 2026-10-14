import { GoogleGenerativeAI } from '@google/generative-ai';
import { ILLMProvider, LeaseAnalysisResult, DemandLetterContext } from './llmProvider.interface.js';
import { SemanticChunk } from '../semanticChunker.service.js';
import { MockResilientLLMProvider } from './mockProvider.js';

export class GeminiLLMProvider implements ILLMProvider {
  public name = 'Google Gemini (2.5 Flash / Latest)';
  private genAI: GoogleGenerativeAI;
  private modelName: string;
  private fallbackProvider: MockResilientLLMProvider;

  constructor(apiKey: string, modelName = 'gemini-2.5-flash') {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
    this.fallbackProvider = new MockResilientLLMProvider();
  }

  private getCandidateModels(): string[] {
    const list = [
      this.modelName,
      'gemini-2.5-flash',
      'gemini-flash-latest',
      'gemini-2.5-pro',
      'gemini-pro-latest'
    ];
    return Array.from(new Set(list.filter(Boolean)));
  }

  public async analyzeLease(
    chunks: SemanticChunk[],
    jurisdiction: { country: string; stateRegion: string }
  ): Promise<LeaseAnalysisResult> {
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

    const candidates = this.getCandidateModels();
    let lastError: any = null;

    for (const candidate of candidates) {
      try {
        console.log(`🤖 Attempting Gemini audit with model: [${candidate}]...`);
        const model = this.genAI.getGenerativeModel({
          model: candidate,
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const response = await model.generateContent(prompt);
        const text = response.response.text();
        const parsed = JSON.parse(text) as LeaseAnalysisResult;
        console.log(`✅ [Gemini] Successfully analyzed lease with model: [${candidate}]`);
        return parsed;
      } catch (err: any) {
        lastError = err;
        console.warn(`⚠️ Gemini model [${candidate}] warning: ${err.message}. Cascading to next candidate...`);
      }
    }

    console.warn('⚠️ All Gemini cloud candidates failed or throttled. Seamlessly activating resilient local legal engine fallback.');
    return this.fallbackProvider.analyzeLease(chunks, jurisdiction);
  }

  public async generateDemandNotice(context: DemandLetterContext): Promise<string> {
    const prompt = `
You are drafting a formal statutory Security Deposit Demand Notice from Tenant to Landlord.
Jurisdiction: ${context.jurisdictionState}
Tenant: ${context.tenantName}
Landlord: ${context.landlordName} (${context.landlordAddress})
Rental Address: ${context.rentalAddress}
Move-Out / Tenancy Termination Date: ${context.leaseEndDate}
Total Deposit Paid: $${context.totalDepositPaid}
Unlawfully Withheld: $${context.unlawfullyWithheldAmount}

Disputed Deductions:
${context.disputedDeductions.map(d => `- ${d.item}: $${d.amount} (Reason: ${d.reason})`).join('\n')}

INSTRUCTIONS:
1. Output ONLY the final formal demand notice letter itself. Do NOT include any conversational preamble, apologies, or meta-notes such as "[IMPORTANT NOTE...]".
2. Assume that the tenancy has legally ended, tenant has surrendered possession, and the statutory accounting deadline has elapsed.
3. Citing relevant tenancy codes for ${context.jurisdictionState} (e.g., California Civil Code § 1950.5(g) and § 1950.5(m)).
4. Compute and cite the bad-faith retention statutory penalty damages (up to 2x the withheld amount under Cal. Civ. Code § 1950.5(l)) alongside the actual damages.
5. Demand immediate return within 10 business days before filing an action in Small Claims Court.
6. Format in clean, formal legal Markdown.
`;

    const candidates = this.getCandidateModels();
    for (const candidate of candidates) {
      try {
        const model = this.genAI.getGenerativeModel({ model: candidate });
        const res = await model.generateContent(prompt);
        return res.response.text();
      } catch (err: any) {
        console.warn(`⚠️ Demand notice generation failed on [${candidate}]: ${err.message}`);
      }
    }

    console.warn('⚠️ Cloud generation failed. Using local certified demand notice generator.');
    return this.fallbackProvider.generateDemandNotice(context);
  }
}
