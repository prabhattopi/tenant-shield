import mongoose, { Schema, Document } from 'mongoose';

export interface ILeaseClause {
  clauseId: string;
  sectionTitle: string;
  pageNumber: number;
  rawText: string;
  severity: 'CRITICAL_ILLEGAL' | 'HIGH_RISK' | 'MODERATE_UNUSUAL' | 'FAIR';
  category: 'DEPOSIT_FORFEITURE' | 'ENTRY_RIGHTS' | 'REPAIR_LIABILITY' | 'EXCESSIVE_FEES' | 'ARBITRATION_TRAP' | 'OTHER';
  explanation: string;
  statutoryCitation: string;
  suggestedCounterClause: string;
  potentialFinancialLiabilityUSD?: number;
}

export interface ILeaseDocument extends Document {
  userId: string; // Postgres UUID
  fileName: string;
  fileHash: string; // SHA-256
  pageCount: number;
  fileSizeBytes: number;
  jurisdiction: {
    country: string;
    stateRegion: string;
  };
  overallRiskScore: number; // 0 (Safe) to 100 (Predatory)
  executiveSummary: string;
  financialExposureSummary: {
    totalEstimatedRiskUSD: number;
    illegalFeesDetectedUSD: number;
    depositVulnerabilityUSD: number;
  };
  clauses: ILeaseClause[];
  createdAt: Date;
  updatedAt: Date;
}

const LeaseClauseSchema = new Schema<ILeaseClause>({
  clauseId: { type: String, required: true },
  sectionTitle: { type: String, required: true },
  pageNumber: { type: Number, required: true },
  rawText: { type: String, required: true },
  severity: {
    type: String,
    enum: ['CRITICAL_ILLEGAL', 'HIGH_RISK', 'MODERATE_UNUSUAL', 'FAIR'],
    required: true,
  },
  category: {
    type: String,
    enum: ['DEPOSIT_FORFEITURE', 'ENTRY_RIGHTS', 'REPAIR_LIABILITY', 'EXCESSIVE_FEES', 'ARBITRATION_TRAP', 'OTHER'],
    required: true,
  },
  explanation: { type: String, required: true },
  statutoryCitation: { type: String, default: '' },
  suggestedCounterClause: { type: String, default: '' },
  potentialFinancialLiabilityUSD: { type: Number, default: 0 },
});

const LeaseDocumentSchema = new Schema<ILeaseDocument>(
  {
    userId: { type: String, required: true, index: true },
    fileName: { type: String, required: true },
    fileHash: { type: String, required: true, index: true },
    pageCount: { type: Number, default: 0 },
    fileSizeBytes: { type: Number, default: 0 },
    jurisdiction: {
      country: { type: String, default: 'US' },
      stateRegion: { type: String, default: 'CA' },
    },
    overallRiskScore: { type: Number, default: 0, min: 0, max: 100 },
    executiveSummary: { type: String, default: '' },
    financialExposureSummary: {
      totalEstimatedRiskUSD: { type: Number, default: 0 },
      illegalFeesDetectedUSD: { type: Number, default: 0 },
      depositVulnerabilityUSD: { type: Number, default: 0 },
    },
    clauses: [LeaseClauseSchema],
  },
  { timestamps: true }
);

export const LeaseDocument = mongoose.models.LeaseDocument || mongoose.model<ILeaseDocument>('LeaseDocument', LeaseDocumentSchema);
