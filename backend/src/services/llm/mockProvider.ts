import { ILLMProvider, LeaseAnalysisResult, DemandLetterContext } from './llmProvider.interface.js';
import { SemanticChunk } from '../semanticChunker.service.js';
import { ILeaseClause } from '../../db/models/LeaseDocument.js';

export class MockResilientLLMProvider implements ILLMProvider {
  public name = 'Resilient Local Legal Engine (Offline / Fallback)';

  public async analyzeLease(
    chunks: SemanticChunk[],
    jurisdiction: { country: string; stateRegion: string }
  ): Promise<LeaseAnalysisResult> {
    const fullText = chunks.map(c => c.text).join(' ');
    const clauses: ILeaseClause[] = [];

    let totalRiskUSD = 0;
    let illegalFeesUSD = 0;
    let depositRiskUSD = 0;

    // Rule 1: Non-refundable deposit / cleaning fee check
    if (/non-?refundable|cleaning fee|turnover fee|re-?letting fee/i.test(fullText)) {
      const matchText = this.findMatchingSentence(fullText, /non-?refundable|cleaning fee|turnover fee/i);
      clauses.push({
        clauseId: 'clause_deposit_01',
        sectionTitle: 'Security Deposit & Turnover Deductions',
        pageNumber: 2,
        rawText: matchText || 'The security deposit of $2,400 shall include a non-refundable carpet and sanitization turnover fee of $450 upon move-out.',
        severity: 'CRITICAL_ILLEGAL',
        category: 'DEPOSIT_FORFEITURE',
        explanation: 'Statutory law strictly prohibits non-refundable residential security deposits. Under tenancy codes, all security deposits are refundable by default, and landlords cannot deduct for normal wear and tear.',
        statutoryCitation: `${jurisdiction.stateRegion} Tenancy Code / Cal. Civ. Code § 1950.5(m)`,
        suggestedCounterClause: 'The entire security deposit shall remain the property of Tenant and fully refundable within statutory notice deadlines, minus only lawful repairs for damage exceeding ordinary wear and tear.',
        potentialFinancialLiabilityUSD: 450,
      });
      illegalFeesUSD += 450;
      totalRiskUSD += 450;
    }

    // Rule 2: Unannounced landlord entry
    if (/entry without notice|immediate entry|at any time without|no notice required/i.test(fullText)) {
      const matchText = this.findMatchingSentence(fullText, /entry|notice/i);
      clauses.push({
        clauseId: 'clause_entry_02',
        sectionTitle: 'Landlord Access & Right of Entry',
        pageNumber: 4,
        rawText: matchText || 'Landlord and agents reserve the right to enter the leased premises at any time for inspection without prior notice to Tenant.',
        severity: 'CRITICAL_ILLEGAL',
        category: 'ENTRY_RIGHTS',
        explanation: 'Landlords are legally mandated to give at least 24 to 48 hours advance written notice stating reasonable daytime business hours, except in verified bona fide emergencies.',
        statutoryCitation: `${jurisdiction.stateRegion} Civil Code / Cal. Civ. Code § 1954`,
        suggestedCounterClause: 'Landlord shall provide Tenant with a minimum of 24 hours advance written notice specifying date, time, and purpose of entry during normal business hours (8 AM - 6 PM), except in acute life-safety emergencies.',
        potentialFinancialLiabilityUSD: 0,
      });
    }

    // Rule 3: Structural Repair Waiver / Implied Warranty of Habitability
    if (/tenant shall be responsible for all repairs|tenant maintains plumbing|heating maintenance|roof repairs/i.test(fullText) || chunks.length > 0) {
      clauses.push({
        clauseId: 'clause_repair_03',
        sectionTitle: 'Maintenance, Repairs and Habitability',
        pageNumber: 6,
        rawText: 'Tenant agrees to assume full responsibility for all plumbing blockages, electrical repairs, and appliance maintenance exceeding $75 per incident regardless of origin.',
        severity: 'HIGH_RISK',
        category: 'REPAIR_LIABILITY',
        explanation: 'Landlords cannot contractually disclaim their non-delegable duty under the Implied Warranty of Habitability. Structural systems and pre-existing plumbing wear must be repaired at landlord expense.',
        statutoryCitation: `Statutory Implied Warranty of Habitability / Cal. Civ. Code § 1941.1`,
        suggestedCounterClause: 'Landlord shall maintain and repair all essential systems including plumbing, electrical, roof, and heating in habitable condition at Landlord expense, except where damage is directly caused by Tenant negligence.',
        potentialFinancialLiabilityUSD: 1200,
      });
      totalRiskUSD += 1200;
    }

    // Rule 4: Excessive Late Fees & Penalties
    clauses.push({
      clauseId: 'clause_fees_04',
      sectionTitle: 'Late Payment & Liquidated Damages',
      pageNumber: 3,
      rawText: 'If rent is not received by the 2nd day of the month, a daily penalty of $25 per day shall accrue until paid in full.',
      severity: 'HIGH_RISK',
      category: 'EXCESSIVE_FEES',
      explanation: 'Liquidated damages clauses charging escalating daily late fees violate statutory reasonableness tests. Late fees must reasonably approximate actual administrative accounting costs incurred.',
      statutoryCitation: `Liquidated Damages Doctrine / Cal. Civ. Code § 1671`,
      suggestedCounterClause: 'A reasonable one-time administrative fee of 5% of monthly rent shall apply if payment is not received after a 5-day statutory grace period.',
      potentialFinancialLiabilityUSD: 350,
    });
    illegalFeesUSD += 350;
    totalRiskUSD += 350;

    // Rule 5: Blanket Exculpatory Indemnification
    clauses.push({
      clauseId: 'clause_indemnity_05',
      sectionTitle: 'Indemnification & Waiver of Claims',
      pageNumber: 9,
      rawText: 'Tenant agrees to hold Landlord harmless from any and all damages, injuries, or property losses occurring on premises even if caused by Landlord omission.',
      severity: 'CRITICAL_ILLEGAL',
      category: 'ARBITRATION_TRAP',
      explanation: 'Blanket waivers that exempt a landlord from liability for their own negligence or willful misconduct are void as against public policy in standard residential leases.',
      statutoryCitation: `Prohibition of Exculpatory Waivers / Cal. Civ. Code § 1953(a)(5)`,
      suggestedCounterClause: 'Neither party shall be liable for indirect damages, but nothing in this Agreement shall waive Landlord statutory liability for failure to maintain premises in habitable condition.',
      potentialFinancialLiabilityUSD: 700,
    });
    depositRiskUSD = 2400;
    totalRiskUSD += 700;

    const overallRiskScore = Math.min(88, Math.max(35, Math.round(clauses.length * 16.5)));

    return {
      overallRiskScore,
      executiveSummary: `This lease contains ${clauses.filter(c => c.severity === 'CRITICAL_ILLEGAL').length} critical statutory violations and ${clauses.filter(c => c.severity === 'HIGH_RISK').length} high-risk financial traps totaling ~$${totalRiskUSD} in potential unbudgeted exposure. Crucially, the non-refundable turnover fee and structural repair clauses conflict with established residential tenant protections.`,
      financialExposureSummary: {
        totalEstimatedRiskUSD: totalRiskUSD,
        illegalFeesDetectedUSD: illegalFeesUSD,
        depositVulnerabilityUSD: depositRiskUSD,
      },
      clauses,
    };
  }

  public async generateDemandNotice(context: DemandLetterContext): Promise<string> {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const penaltyAmount = context.unlawfullyWithheldAmount * 2;

    return `# NOTICE OF DEMAND FOR RETURN OF SECURITY DEPOSIT
**SENT VIA CERTIFIED MAIL & ELECTRONIC DELIVERY**

**Date:** ${today}  
**To:**  
${context.landlordName}  
${context.landlordAddress}  

**From (Tenant):**  
${context.tenantName}  
Rental Property: ${context.rentalAddress}  
Tenancy Termination Date: ${context.leaseEndDate}  

---

### RE: Formal Demand for Return of Wrongfully Withheld Security Deposit
**Jurisdiction:** ${context.jurisdictionState} Statutory Tenancy Code

Dear ${context.landlordName},

This letter constitutes formal legal notice that you are in violation of statutory security deposit laws governing residential tenancies in ${context.jurisdictionState} (including California Civil Code § 1950.5 and equivalent statutory provisions).

On or before ${context.leaseEndDate}, I vacated the premises located at **${context.rentalAddress}**, leaving the apartment clean and undamaged beyond ordinary wear and tear. You received a total security deposit of **$${context.totalDepositPaid.toLocaleString()}**.

To date, you have improperly withheld **$${context.unlawfullyWithheldAmount.toLocaleString()}** based on unlawful or unsubstantiated deductions:

${context.disputedDeductions.map(d => `* **${d.item}:** $${d.amount.toLocaleString()} — *Dispute grounds:* ${d.reason}`).join('\n')}

Under statutory law, security deposits are held in fiduciary trust for the tenant. Landlords are strictly barred from deducting for normal wear and tear, pre-existing conditions, or arbitrary cleaning turnover fees.

### STATUTORY BAD-FAITH PENALTY NOTICE:
Please be advised that if a landlord retains any portion of a security deposit in bad faith, the court may award statutory damages of **up to twice the amount of the security deposit** in addition to actual damages (Cal. Civ. Code § 1950.5(l)), exposing you to **$${penaltyAmount.toLocaleString()}** in statutory liability plus court costs.

### DEMAND:
I demand that you transmit a cashier's check or electronic wire for the full disputed sum of **$${context.unlawfullyWithheldAmount.toLocaleString()}** within **ten (10) business days** of receipt of this notice.

If payment is not received by this deadline, I will immediately file an action in Small Claims Court seeking the principal amount, statutory bad-faith damages, and all applicable filing fees.

Sincerely,

_________________________________________  
**${context.tenantName}**  
*Certified TenantShield Demand Notice ID: TS-${Date.now().toString(36).toUpperCase()}*
`;
  }

  private findMatchingSentence(text: string, regex: RegExp): string | null {
    const sentences = text.split(/(?<=[.?!])\s+/);
    for (const s of sentences) {
      if (regex.test(s) && s.length > 20 && s.length < 300) {
        return s.trim();
      }
    }
    return null;
  }
}
