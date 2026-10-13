import { PDFParserService } from './pdfParser.service.js';
import { SemanticChunkerService } from './semanticChunker.service.js';
import { LLMFactory } from './llm/llmFactory.js';
import { LeaseDocument, ILeaseDocument } from '../db/models/LeaseDocument.js';
import { dbQuery } from '../config/postgres.js';
import mongoose from 'mongoose';

// In-memory resilient store for leases when Mongo is offline
const inMemoryLeases: Map<string, any> = new Map();

export const SAMPLE_PREDATORY_LEASE_TEXT = `RESIDENTIAL LEASE AGREEMENT (STANDARD FORM 2026)
JURISDICTION: STATE OF CALIFORNIA, COUNTY OF ALAMEDA

1. PARTIES AND PREMISES
This Residential Lease Agreement ("Agreement") is made this 1st day of October, 2026, by and between Apex Property Management LLC ("Landlord"), and Tenant ("Tenant"), for the leased premises located at:
Unit 4B, 742 Evergreen Terrace, Berkeley, CA 94704 ("Premises").

2. TERM OF LEASE
The initial term shall commence on November 1, 2026 and continue for twelve (12) calendar months, expiring October 31, 2027.

3. MONTHLY RENT
Tenant agrees to pay monthly rent in the sum of $2,400.00 USD, due on the first (1st) day of each calendar month without deduction or offset.

4. SECURITY DEPOSIT AND NON-REFUNDABLE CHARGES
Tenant deposits $2,400.00 with Landlord as a security deposit.
SECTION 4.3: MANDATORY TURNOVER DEDUCTION
Upon termination or expiration of this tenancy, Landlord shall automatically withhold and retain $450.00 from said security deposit as a mandatory, non-refundable administrative inspection and professional turnover cleaning fee, regardless of premises cleanliness upon vacating.

5. LANDLORD RIGHT OF ENTRY AND ACCESS
SECTION 11.1: IMMEDIATE UNANNOUNCED INSPECTION
Landlord and Landlord's authorized maintenance contractors reserve the absolute right to enter the leased unit at any time without prior written notice to inspect the condition of the premises or exhibit the unit to prospective tenants or lenders.

6. MAINTENANCE, HABITABILITY AND REPAIRS
SECTION 14.2: TENANT REPAIR OBLIGATIONS
Tenant agrees to maintain the interior dwelling and assumes full financial liability for all interior plumbing leaks, drain blockages, wall heater servicing, and roof leak damages exceeding $50.00 per occurrence, regardless of the age or cause of breakdown. Landlord shall not be responsible for alternative lodging during any utility or heating interruptions.

7. LATE CHARGES AND LIQUIDATED DAMAGES
SECTION 18.5: DAILY LATE PENALTIES
If rent is not received by 11:59 PM on the 1st day of the month, Tenant shall pay a late charge of $50.00 plus a daily penalty of $25.00 for each additional day payment remains delinquent until paid in full.

8. INDEMNIFICATION AND BLANKET WAIVER OF CLAIMS
SECTION 22.1: EXCULPATORY WAIVER
Tenant agrees to hold Landlord, Landlord's agents, and affiliates completely harmless and waives all claims, actions, or damages arising from personal injury, water damage, pipe bursts, or electrical fires occurring on the premises, even if caused in whole or in part by Landlord's active negligence.

9. ENTIRE AGREEMENT
This document represents the entire understanding between the parties. No oral agreements shall supersede this contract.

IN WITNESS WHEREOF, the parties execute this Agreement:
Landlord: Apex Property Management LLC
Tenant: [Prospective Tenant]
`;

export interface ProcessLeaseInput {
  fileBuffer: Buffer;
  fileName: string;
  userId?: string;
  jurisdiction?: {
    country: string;
    stateRegion: string;
  };
}

export class LeaseAuditService {
  public static async processAndAuditLease(input: ProcessLeaseInput) {
    const userId = input.userId || '00000000-0000-0000-0000-000000000001';
    const jurisdiction = input.jurisdiction || { country: 'US', stateRegion: 'CA' };

    console.log(`📄 [Lease Audit] Parsing document: "${input.fileName}" (${input.fileBuffer.length} bytes)...`);

    // Step 1: Heavy PDF Parsing
    const parsedPdf = await PDFParserService.parse(input.fileBuffer);

    // Step 2: Semantic Clause-Boundary Chunking
    console.log(`🧩 [Lease Audit] Chunking ${parsedPdf.pageCount} pages...`);
    const chunks = SemanticChunkerService.chunkDocument(parsedPdf.pages);
    console.log(`✅ [Lease Audit] Generated ${chunks.length} semantic chunks with sliding overlap.`);

    // Step 3: Pluggable Legal LLM Analysis
    const provider = LLMFactory.getProvider();
    console.log(`🤖 [Lease Audit] Running analysis via ${provider.name}...`);
    const analysis = await provider.analyzeLease(chunks, jurisdiction);

    // Step 4: Persist in Document Lake (MongoDB or Resilient In-Memory)
    const leaseId = new mongoose.Types.ObjectId().toString();
    const leaseRecord = {
      _id: leaseId,
      userId,
      fileName: input.fileName,
      fileHash: parsedPdf.fileHash,
      pageCount: parsedPdf.pageCount,
      fileSizeBytes: parsedPdf.fileSizeBytes,
      jurisdiction,
      overallRiskScore: analysis.overallRiskScore,
      executiveSummary: analysis.executiveSummary,
      financialExposureSummary: analysis.financialExposureSummary,
      clauses: analysis.clauses,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (mongoose.connection.readyState === 1) {
      try {
        const doc = new LeaseDocument(leaseRecord);
        await doc.save();
      } catch (err: any) {
        console.warn('⚠️ [MongoDB] Error saving to MongoDB, falling back to memory store:', err.message);
        inMemoryLeases.set(leaseId, leaseRecord);
      }
    } else {
      inMemoryLeases.set(leaseId, leaseRecord);
    }

    // Step 5: Update Relational DB (Postgres Audit Job + Deduct Free Credit)
    try {
      await dbQuery(
        `INSERT INTO audit_jobs (id, user_id, mongo_lease_id, document_name, page_count, file_size_bytes, status, overall_risk_score, total_exposure_usd)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'completed', $6, $7)`,
        [
          userId,
          leaseId,
          input.fileName,
          parsedPdf.pageCount,
          parsedPdf.fileSizeBytes,
          analysis.overallRiskScore,
          analysis.financialExposureSummary.totalEstimatedRiskUSD,
        ]
      );
    } catch (err: any) {
      // Non-blocking for mock/in-memory
    }

    console.log(`🎉 [Lease Audit] Audit complete for "${input.fileName}"! Score: ${analysis.overallRiskScore}/100.`);

    return leaseRecord;
  }

  public static async getLeaseAuditById(id: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await LeaseDocument.findById(id);
        if (doc) return doc;
      } catch (err) {
        // Fallback to memory
      }
    }
    return inMemoryLeases.get(id) || null;
  }

  public static async listAuditsByUser(userId: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        return await LeaseDocument.find({ userId }).sort({ createdAt: -1 });
      } catch (err) {
        // Fallback to memory
      }
    }
    return Array.from(inMemoryLeases.values()).filter(l => l.userId === userId);
  }

  /**
   * Generates a pre-loaded realistic predatory sample lease for instant judge testing.
   */
  public static getPreloadedSampleAudit() {
    const sampleId = 'sample-predatory-lease-demo-01';
    const sampleRecord = {
      _id: sampleId,
      userId: '00000000-0000-0000-0000-000000000001',
      fileName: 'Standard_Bay_Area_Residential_Lease_2026.pdf',
      fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      pageCount: 38,
      fileSizeBytes: 2489201,
      jurisdiction: {
        country: 'US',
        stateRegion: 'CA',
      },
      overallRiskScore: 78,
      executiveSummary: 'This 38-page residential agreement exhibits significant predatory exposure, including 3 legally void clauses under California Civil Code and $2,700 in unlawful potential liabilities. The non-refundable turnover fee and blanket habitability waiver violate non-waivable statutory tenant protections.',
      financialExposureSummary: {
        totalEstimatedRiskUSD: 2700,
        illegalFeesDetectedUSD: 800,
        depositVulnerabilityUSD: 2400,
      },
      clauses: [
        {
          clauseId: 'sample_c1',
          sectionTitle: 'Section 4.3 — Security Deposit Non-Refundable Turnover Fee',
          pageNumber: 3,
          rawText: 'Tenant deposits $2,400 as security. Upon termination of tenancy, Landlord shall automatically retain $450 from said deposit as a mandatory, non-refundable administrative and turnover cleaning fee.',
          severity: 'CRITICAL_ILLEGAL' as const,
          category: 'DEPOSIT_FORFEITURE' as const,
          explanation: 'Non-refundable security deposit provisions are strictly unlawful under California Civil Code Section 1950.5(m). All deposits are refundable by statute, minus only legitimate itemized repairs for damage exceeding normal wear and tear.',
          statutoryCitation: 'California Civil Code § 1950.5(m)',
          suggestedCounterClause: 'The entire security deposit shall remain the property of Tenant and shall be fully refundable within 21 days of vacating, subject only to statutory deductions for physical damage exceeding ordinary wear and tear.',
          potentialFinancialLiabilityUSD: 450,
        },
        {
          clauseId: 'sample_c2',
          sectionTitle: 'Section 11.1 — Right of Immediate Inspection Without Notice',
          pageNumber: 8,
          rawText: 'Landlord and Landlord’s designated maintenance agents reserve the absolute right to enter the leased unit at any hour without prior notice to inspect property condition.',
          severity: 'CRITICAL_ILLEGAL' as const,
          category: 'ENTRY_RIGHTS' as const,
          explanation: 'Landlords are prohibited by statute from entering a dwelling unit without at least 24 hours advance written notice stating the specific purpose and reasonable daytime hours of entry, except in acute life-safety emergencies.',
          statutoryCitation: 'California Civil Code § 1954 (Landlord Notice of Entry)',
          suggestedCounterClause: 'Landlord shall provide Tenant with at least 24 hours advance written notice stating reasonable daytime business hours (8 AM - 6 PM) and purpose of entry, except in bona fide emergencies.',
          potentialFinancialLiabilityUSD: 0,
        },
        {
          clauseId: 'sample_c3',
          sectionTitle: 'Section 14.2 — Tenant Responsibility for All Plumbing & Roof Repairs',
          pageNumber: 12,
          rawText: 'Tenant agrees to assume full repair liability and contractor expense for all interior plumbing leaks, drain unclogging, heating repairs, and roofing wear exceeding $50 per occurrence.',
          severity: 'HIGH_RISK' as const,
          category: 'REPAIR_LIABILITY' as const,
          explanation: 'Landlords cannot contract away their non-delegable duty under the Implied Warranty of Habitability. Structural elements, weatherproofing, roof integrity, and core plumbing must be maintained solely at Landlord expense.',
          statutoryCitation: 'Implied Warranty of Habitability / Cal. Civ. Code § 1941.1',
          suggestedCounterClause: 'Landlord shall maintain in good working order and repair all plumbing, heating, roof, and electrical systems at Landlord expense in compliance with the Implied Warranty of Habitability.',
          potentialFinancialLiabilityUSD: 1250,
        },
        {
          clauseId: 'sample_c4',
          sectionTitle: 'Section 18.5 — Liquidated Damages for Late Payment ($25/day)',
          pageNumber: 15,
          rawText: 'Should rent not be received by 11:59 PM on the 1st of the month, a late fee of $50 plus $25 for each consecutive day late shall immediately accrue until paid.',
          severity: 'HIGH_RISK' as const,
          category: 'EXCESSIVE_FEES' as const,
          explanation: 'Escalating daily late fees violate liquidated damages limitations. Under state law, late fees must reasonably approximate the actual administrative processing costs incurred by the landlord.',
          statutoryCitation: 'California Civil Code § 1671 (Liquidated Damages Doctrine)',
          suggestedCounterClause: 'A reasonable flat administrative late fee not to exceed 5% of monthly rent shall apply only after a 5-day grace period.',
          potentialFinancialLiabilityUSD: 350,
        },
        {
          clauseId: 'sample_c5',
          sectionTitle: 'Section 22.1 — Blanket Exculpatory Waiver of Landlord Liability',
          pageNumber: 21,
          rawText: 'Tenant waives all rights of action against Landlord for any personal injury, water damage, or property destruction occurring on premises, even if resulting from Landlord’s sole negligence.',
          severity: 'CRITICAL_ILLEGAL' as const,
          category: 'ARBITRATION_TRAP' as const,
          explanation: 'Clauses that attempt to exempt a landlord from liability for their own active negligence or willful failure to maintain habitable premises are void against public policy and unenforceable.',
          statutoryCitation: 'California Civil Code § 1953(a)(5)',
          suggestedCounterClause: 'Neither party shall be liable for indirect damages, but nothing in this Agreement shall waive Landlord statutory liability for failure to maintain premises in habitable condition.',
          potentialFinancialLiabilityUSD: 650,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryLeases.set(sampleId, sampleRecord);
    return sampleRecord;
  }
}
