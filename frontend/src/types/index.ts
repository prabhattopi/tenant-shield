export interface SystemHealthData {
  service: string;
  version: string;
  status: string;
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  memoryUsageMB: number;
  databases: {
    relational: {
      engine: string;
      connected: boolean;
      mode: string;
    };
    documentStore: {
      engine: string;
      connected: boolean;
      mode: string;
    };
  };
  llm: {
    activeProvider: string;
    geminiKeyConfigured: boolean;
  };
  billing: {
    stripeConfigured: boolean;
    mode: string;
  };
}

export interface ClauseAnalysis {
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

export interface LeaseAuditSummary {
  id: string;
  fileName: string;
  pageCount: number;
  overallRiskScore: number;
  executiveSummary: string;
  financialExposureSummary: {
    totalEstimatedRiskUSD: number;
    illegalFeesDetectedUSD: number;
    depositVulnerabilityUSD: number;
  };
  clauses: ClauseAnalysis[];
  createdAt: string;
}
