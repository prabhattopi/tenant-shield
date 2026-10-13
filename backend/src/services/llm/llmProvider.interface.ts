import { SemanticChunk } from '../semanticChunker.service.js';
import { ILeaseClause } from '../../db/models/LeaseDocument.js';

export interface LeaseAnalysisResult {
  overallRiskScore: number; // 0 to 100
  executiveSummary: string;
  financialExposureSummary: {
    totalEstimatedRiskUSD: number;
    illegalFeesDetectedUSD: number;
    depositVulnerabilityUSD: number;
  };
  clauses: ILeaseClause[];
}

export interface DemandLetterContext {
  landlordName: string;
  landlordAddress: string;
  tenantName: string;
  rentalAddress: string;
  leaseEndDate: string;
  totalDepositPaid: number;
  unlawfullyWithheldAmount: number;
  jurisdictionState: string;
  disputedDeductions: Array<{ item: string; amount: number; reason: string }>;
}

export interface ILLMProvider {
  name: string;
  analyzeLease(chunks: SemanticChunk[], jurisdiction: { country: string; stateRegion: string }): Promise<LeaseAnalysisResult>;
  generateDemandNotice(context: DemandLetterContext): Promise<string>;
}
