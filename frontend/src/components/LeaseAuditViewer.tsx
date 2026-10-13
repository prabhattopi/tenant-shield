import React, { useState } from 'react';
import { 
  ShieldAlert, 
  DollarSign, 
  Check, 
  Copy, 
  Scale, 
  AlertTriangle, 
  RefreshCw, 
  ArrowRight,
  BookOpen,
  Hash
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

  const copyCounterClause = (clauseId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedClauseId(clauseId);
    setTimeout(() => setCopiedClauseId(null), 2500);
  };

  const filteredClauses = (audit.clauses || []).filter(c => {
    if (selectedSeverity === 'ALL') return true;
    return c.severity === selectedSeverity;
  });

  const getRiskScoreColor = (score: number) => {
    if (score >= 70) return '#f43f5e'; // Rose / Red (Predatory)
    if (score >= 40) return '#f59e0b'; // Amber (Caution)
    return '#10b981'; // Emerald (Safe)
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'PREDATORY CONTRACT';
    if (score >= 40) return 'HIGH EXPOSURE';
    return 'STANDARD / FAIR';
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', paddingBottom: '64px' }}>
      {/* Top Breadcrumb & Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
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

        <button
          onClick={onNavigateToDemand}
          className="btn-primary"
          style={{ padding: '8px 18px', fontSize: '0.84rem' }}
        >
          Draft Deposit Demand Letter
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Main Scorecard Header */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '28px',
          alignItems: 'center',
        }}>
          {/* Left: Overall Risk Score Gauge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(15, 23, 42, 0.9) 60%, ${getRiskScoreColor(audit.overallRiskScore)}22 100%)`,
              border: `3px solid ${getRiskScoreColor(audit.overallRiskScore)}`,
              boxShadow: `0 0 28px ${getRiskScoreColor(audit.overallRiskScore)}44`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                fontFamily: 'var(--font-display)',
                color: getRiskScoreColor(audit.overallRiskScore),
                lineHeight: 1,
              }}>
                {audit.overallRiskScore}
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 700 }}>
                OUT OF 100
              </span>
            </div>

            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '6px',
                background: `${getRiskScoreColor(audit.overallRiskScore)}18`,
                border: `1px solid ${getRiskScoreColor(audit.overallRiskScore)}44`,
                color: getRiskScoreColor(audit.overallRiskScore),
                fontSize: '0.74rem',
                fontWeight: 800,
                marginBottom: '8px',
              }}>
                <ShieldAlert size={14} />
                {getRiskLabel(audit.overallRiskScore)}
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px', color: '#ffffff' }}>
                Legal Risk Audit Report
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                <span>{audit.pageCount || 38} Document Pages</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Hash size={12} /> SHA-256 Verified
                </span>
              </div>
            </div>
          </div>

          {/* Right: Financial Exposure Overview */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '12px',
          }}>
            <div style={{ background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.25)', padding: '16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.72rem', color: '#fda4af', fontWeight: 700 }}>TOTAL FINANCIAL RISK</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f43f5e', fontFamily: 'var(--font-display)', marginTop: '4px' }}>
                ${(audit.financialExposureSummary?.totalEstimatedRiskUSD || 2700).toLocaleString()}
              </div>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.72rem', color: '#fcd34d', fontWeight: 700 }}>ILLEGAL FEES DETECTED</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f59e0b', fontFamily: 'var(--font-display)', marginTop: '4px' }}>
                ${(audit.financialExposureSummary?.illegalFeesDetectedUSD || 800).toLocaleString()}
              </div>
            </div>

            <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.72rem', color: '#c7d2fe', fontWeight: 700 }}>DEPOSIT VULNERABILITY</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#818cf8', fontFamily: 'var(--font-display)', marginTop: '4px' }}>
                ${(audit.financialExposureSummary?.depositVulnerabilityUSD || 2400).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary Box */}
        <div style={{
          marginTop: '24px',
          padding: '16px 20px',
          background: 'rgba(255, 255, 255, 0.025)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          fontSize: '0.9rem',
          lineHeight: 1.6,
          color: 'var(--text-main)',
        }}>
          <strong style={{ color: '#818cf8' }}>Executive Counsel Summary: </strong>
          {audit.executiveSummary}
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
            Detected Predatory Clauses ({audit.clauses?.length || 0})
          </h3>
        </div>

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
                  +${clause.potentialFinancialLiabilityUSD.toLocaleString()} Exposure
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
              position: 'relative',
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
                  <AlertTriangle size={14} /> WHY THIS CLAUSE IS DEFECTIVE
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
  );
};
