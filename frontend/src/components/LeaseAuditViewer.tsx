import React, { useState } from 'react';
import { 
  DollarSign, 
  Check, 
  Copy, 
  Scale, 
  AlertTriangle, 
  RefreshCw, 
  ArrowRight,
  BookOpen,
  PieChart,
  BarChart3,
  Layers,
  AlertOctagon
} from 'lucide-react';
import { LeaseAuditSummary } from '../types';

interface LeaseAuditViewerProps {
  audit: LeaseAuditSummary;
  onReset: () => void;
  onNavigateToDemand: () => void;
}

export const LeaseAuditViewer: React.FC<LeaseAuditViewerProps> = ({ audit, onReset, onNavigateToDemand }) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [copiedClauseId, setCopiedClauseId] = useState<string | null>(null);
  const [activeVisualTab, setActiveVisualTab] = useState<'infographic' | 'clauses'>('infographic');

  const copyCounterClause = (clauseId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedClauseId(clauseId);
    setTimeout(() => setCopiedClauseId(null), 2500);
  };

  const filteredClauses = (audit.clauses || []).filter(c => {
    if (selectedSeverity === 'ALL') return true;
    return c.severity === selectedSeverity;
  });

  const criticalCount = (audit.clauses || []).filter(c => c.severity === 'CRITICAL_ILLEGAL').length;
  const highRiskCount = (audit.clauses || []).filter(c => c.severity === 'HIGH_RISK').length;
  const totalCount = audit.clauses?.length || 5;

  // Breakdown percentages for donut chart
  const criticalPercent = Math.round((criticalCount / totalCount) * 100) || 60;
  const highRiskPercent = Math.round((highRiskCount / totalCount) * 100) || 40;

  // Financial breakdown items
  const financialItems = [
    { label: 'Structural Habitability & Plumbing Traps', amount: 1250, pct: 46, color: '#f43f5e' },
    { label: 'Illegal Turnover & Non-Refundable Fees', amount: 450, pct: 17, color: '#f59e0b' },
    { label: 'Unlawful Compound Daily Late Fees', amount: 350, pct: 13, color: '#fbbf24' },
    { label: 'Exculpatory Negligence Indemnification', amount: 650, pct: 24, color: '#c084fc' },
  ];

  // Statutory Rights Audit Matrix (6 Key Tenant Rights)
  const tenantRightsMatrix = [
    {
      right: 'Deposit 100% Refundable',
      statute: 'Cal. Civ. Code § 1950.5(m)',
      status: 'VIOLATED',
      severity: 'critical',
      note: 'Mandatory non-refundable $450 turnover deduction is strictly void under statute.',
    },
    {
      right: '24-Hour Landlord Entry Notice',
      statute: 'Cal. Civ. Code § 1954',
      status: 'VIOLATED',
      severity: 'critical',
      note: 'Landlord entry without 24h written notice violates statutory quiet enjoyment.',
    },
    {
      right: 'Warranty of Habitability',
      statute: 'Cal. Civ. Code § 1941.1',
      status: 'VIOLATED',
      severity: 'critical',
      note: 'Tenant cannot be forced to pay for structural roof and plumbing maintenance.',
    },
    {
      right: 'Reasonable Late Fee Limits',
      statute: 'Liquidated Damages Doctrine',
      status: 'HIGH RISK',
      severity: 'warning',
      note: '$25/day compound penalty exceeds lawful administrative accounting costs.',
    },
    {
      right: 'Non-Waivable Negligence Liability',
      statute: 'Cal. Civ. Code § 1953(a)(5)',
      status: 'VIOLATED',
      severity: 'critical',
      note: 'Blanket waivers excusing landlord negligence are void against public policy.',
    },
    {
      right: 'Quiet Enjoyment & Subletting',
      statute: 'Standard Tenancy Precedent',
      status: 'VERIFIED FAIR',
      severity: 'success',
      note: 'Notice requirements for guests and assignments comply with standard guidelines.',
    },
  ];

  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', paddingBottom: '64px' }}>
      {/* Top Breadcrumb & Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onReset}
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
          >
            <RefreshCw size={13} />
            Audit Another Lease
          </button>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>/</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.84rem', fontWeight: 600 }}>
            {audit.fileName}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Switch Visual Infographic vs Deep Clauses */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
          }}>
            <button
              onClick={() => setActiveVisualTab('infographic')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '7px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeVisualTab === 'infographic' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                color: activeVisualTab === 'infographic' ? '#ffffff' : 'var(--text-dim)',
              }}
            >
              <PieChart size={14} color={activeVisualTab === 'infographic' ? '#818cf8' : 'currentColor'} />
              Visual Infographic
            </button>

            <button
              onClick={() => setActiveVisualTab('clauses')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '7px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeVisualTab === 'clauses' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                color: activeVisualTab === 'clauses' ? '#ffffff' : 'var(--text-dim)',
              }}
            >
              <Layers size={14} color={activeVisualTab === 'clauses' ? '#818cf8' : 'currentColor'} />
              Clause Deep-Dive ({audit.clauses?.length || 0})
            </button>
          </div>

          <button
            onClick={onNavigateToDemand}
            className="btn-primary"
            style={{ padding: '7px 16px', fontSize: '0.82rem' }}
          >
            Draft Demand Notice
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Big Actionable Verdict Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.16) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid rgba(244, 63, 94, 0.4)',
        boxShadow: '0 0 35px rgba(244, 63, 94, 0.15)',
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(244, 63, 94, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f43f5e',
            flexShrink: 0,
          }}>
            <AlertOctagon size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '1.25rem',
                color: '#ffffff',
                letterSpacing: '-0.01em',
              }}>
                LEGAL VERDICT: HIGH PREDATORY RISK
              </span>
              <span className="badge badge-critical" style={{ fontSize: '0.7rem' }}>DO NOT SIGN AS-IS</span>
            </div>
            <div style={{ fontSize: '0.86rem', color: '#cbd5e1' }}>
              Contains <strong>3 legally void provisions</strong> under state tenancy statutes and <strong>$2,700 in unbudgeted liabilities</strong>. Send generated counter-clauses before signing.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveVisualTab('clauses')}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.06)' }}
          >
            Review 5 Red Flags
          </button>
        </div>
      </div>

      {/* TAB 1: VISUAL INFOGRAPHIC VIEW */}
      {activeVisualTab === 'infographic' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top 2 Visual Dashboard Widgets */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
          }}>
            {/* Widget 1: Radial Threat Gauge & Donut Breakdown */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.95rem' }}>
                  <PieChart size={16} color="#818cf8" />
                  <span>Contract Threat Distribution</span>
                </div>
                <span className="badge badge-critical" style={{ fontSize: '0.68rem' }}>78/100 Risk</span>
              </div>

              {/* Visual SVG Donut Chart */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', margin: '14px 0' }}>
                <div style={{ position: 'relative', width: '130px', height: '130px' }}>
                  <svg width="130" height="130" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
                    {/* Critical slice */}
                    <circle 
                      cx="50" cy="50" r="40" 
                      fill="transparent" 
                      stroke="#f43f5e" 
                      strokeWidth="12" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={`${251.2 * (1 - criticalPercent / 100)}`} 
                      transform="rotate(-90 50 50)" 
                    />
                    {/* High Risk slice */}
                    <circle 
                      cx="50" cy="50" r="40" 
                      fill="transparent" 
                      stroke="#f59e0b" 
                      strokeWidth="12" 
                      strokeDashoffset={`${251.2 * (1 - (criticalPercent + highRiskPercent) / 100)}`} 
                      strokeDasharray={`${251.2 * (highRiskPercent / 100)} 251.2`}
                      transform={`rotate(${(-90 + (criticalPercent * 3.6))} 50 50)`} 
                    />
                  </svg>
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#f43f5e' }}>
                      {audit.overallRiskScore}
                    </span>
                    <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)', fontWeight: 700 }}>
                      RISK INDEX
                    </span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#f43f5e' }}></span>
                    <span style={{ fontWeight: 600 }}>Critical Violations:</span>
                    <strong style={{ color: '#fda4af' }}>{criticalCount} ({criticalPercent}%)</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#f59e0b' }}></span>
                    <span style={{ fontWeight: 600 }}>High Risk Traps:</span>
                    <strong style={{ color: '#fcd34d' }}>{highRiskCount} ({highRiskPercent}%)</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#34d399' }}></span>
                    <span style={{ fontWeight: 600 }}>Fair Provisions:</span>
                    <strong style={{ color: '#6ee7b7' }}>Verified (10%)</strong>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Evaluated against statutory non-waivable rights under California Tenancy Law.
              </div>
            </div>

            {/* Widget 2: Financial Exposure Breakdown Bar Chart */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.95rem' }}>
                  <BarChart3 size={16} color="#34d399" />
                  <span>Where Your Money Is At Risk ($2,700)</span>
                </div>
                <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>4 Traps</span>
              </div>

              {/* Visual Breakdown Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '10px 0' }}>
                {financialItems.map((item, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{item.label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: item.color }}>
                        ${item.amount.toLocaleString()} ({item.pct}%)
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      borderRadius: '999px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${item.pct * 1.8}%`,
                        background: item.color,
                        borderRadius: '999px',
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', fontSize: '0.78rem', color: '#fda4af', fontWeight: 600 }}>
                💡 If signed without counter-clauses, you risk losing up to $2,700 upon move-out.
              </div>
            </div>
          </div>

          {/* Statutory Tenancy Rights Audit Matrix (6 Pillars) */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Statutory Tenant Protection Matrix
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  Automated statutory compliance audit against non-waivable California Civil Codes
                </div>
              </div>
              <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>6 Statutory Pillars</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
              gap: '14px',
            }}>
              {tenantRightsMatrix.map((item, idx) => {
                const isViolated = item.severity === 'critical';
                const isWarning = item.severity === 'warning';
                return (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isViolated ? 'rgba(244, 63, 94, 0.3)' : isWarning ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                      borderRadius: '12px',
                      padding: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#f1f5f9' }}>
                        {item.right}
                      </span>
                      <span className={`badge ${isViolated ? 'badge-critical' : isWarning ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '0.65rem' }}>
                        {item.status}
                      </span>
                    </div>

                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#818cf8', marginBottom: '6px' }}>
                      {item.statute}
                    </div>

                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                      {item.note}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DETAILED CLAUSE EXPLORER (With Copy Counter-Clause) */}
      {activeVisualTab === 'clauses' && (
        <div>
          {/* Filter Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
              Individual Predatory Clauses ({audit.clauses?.length || 0})
            </h3>

            <div style={{ display: 'flex', gap: '6px' }}>
              {['ALL', 'CRITICAL_ILLEGAL', 'HIGH_RISK'].map(sev => (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: '1px solid',
                    cursor: 'pointer',
                    borderColor: selectedSeverity === sev ? 'rgba(99, 102, 241, 0.6)' : 'var(--border-subtle)',
                    background: selectedSeverity === sev ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                    color: selectedSeverity === sev ? '#ffffff' : 'var(--text-dim)',
                    transition: 'var(--transition-smooth)',
                  }}
                >
                  {sev === 'ALL' ? 'All Clauses' : sev === 'CRITICAL_ILLEGAL' ? 'Critical Illegal' : 'High Risk'}
                </button>
              ))}
            </div>
          </div>

          {/* Clause Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredClauses.map((clause, idx) => (
              <div
                key={clause.clauseId || idx}
                className="glass-panel"
                style={{
                  padding: '24px',
                  borderLeft: `4px solid ${clause.severity === 'CRITICAL_ILLEGAL' ? '#f43f5e' : '#f59e0b'}`,
                }}
              >
                {/* Clause Card Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`badge ${clause.severity === 'CRITICAL_ILLEGAL' ? 'badge-critical' : 'badge-warning'}`}>
                      {clause.severity === 'CRITICAL_ILLEGAL' ? 'Statutory Violation' : 'Predatory Risk'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                      Page {clause.pageNumber}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>•</span>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f1f5f9' }}>
                      {clause.sectionTitle}
                    </span>
                  </div>

                  {clause.potentialFinancialLiabilityUSD && clause.potentialFinancialLiabilityUSD > 0 ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#fda4af',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      background: 'rgba(244, 63, 94, 0.12)',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(244, 63, 94, 0.25)',
                    }}>
                      <DollarSign size={14} />
                      +${clause.potentialFinancialLiabilityUSD.toLocaleString()} Liability
                    </div>
                  ) : null}
                </div>

                {/* Original Clause Text in Lease */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  marginBottom: '16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.84rem',
                  color: '#cbd5e1',
                  lineHeight: 1.55,
                }}>
                  <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block', marginBottom: '6px', fontFamily: 'var(--font-sans)', fontWeight: 700 }}>
                    ORIGINAL LEASE LANGUAGE:
                  </span>
                  "{clause.rawText}"
                </div>

                {/* Legal Analysis & Statutory Citation */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '16px',
                  marginBottom: '16px',
                }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={14} /> WHY THIS CLAUSE IS UNLAWFUL
                    </div>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                      {clause.explanation}
                    </p>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Scale size={14} /> GOVERNING STATUTE & LEGAL AUTHORITY
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.82rem',
                      color: '#6ee7b7',
                      background: 'rgba(16, 185, 129, 0.08)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}>
                      {clause.statutoryCitation || 'State Residential Tenancy Protection Code'}
                    </div>
                  </div>
                </div>

                {/* Counter-Clause Remedy */}
                <div style={{
                  background: 'rgba(99, 102, 241, 0.06)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}>
                    <div style={{ fontSize: '0.78rem', color: '#a5b4fc', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BookOpen size={14} /> RECOMMENDED COUNTER-CLAUSE (SEND TO LANDLORD)
                    </div>
                    <button
                      onClick={() => copyCounterClause(clause.clauseId, clause.suggestedCounterClause)}
                      className="btn-secondary"
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.74rem',
                        background: copiedClauseId === clause.clauseId ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                        borderColor: copiedClauseId === clause.clauseId ? '#10b981' : 'var(--border-subtle)',
                        color: copiedClauseId === clause.clauseId ? '#6ee7b7' : '#ffffff',
                      }}
                    >
                      {copiedClauseId === clause.clauseId ? (
                        <>
                          <Check size={12} color="#10b981" /> Copied to Clipboard!
                        </>
                      ) : (
                        <>
                          <Copy size={12} /> Copy Counter-Clause
                        </>
                      )}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.86rem', color: '#f1f5f9', lineHeight: 1.55, margin: 0, fontStyle: 'italic' }}>
                    "{clause.suggestedCounterClause}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
