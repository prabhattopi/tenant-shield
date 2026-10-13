import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HealthStatusBadge } from './components/HealthStatusBadge';
import { LeaseUploader } from './components/LeaseUploader';
import { LeaseAuditViewer } from './components/LeaseAuditViewer';
import { PricingSection } from './components/PricingSection';
import { EvidenceVaultViewer } from './components/EvidenceVaultViewer';
import { DemandNoticeGenerator } from './components/DemandNoticeGenerator';
import { LeaseAuditSummary } from './types';
import { Scale, Database, Cpu, FileText, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'audit' | 'vault' | 'demand' | 'billing' | 'system'>('audit');
  const [creditsRemaining, setCreditsRemaining] = useState<number>(1);
  const [planTier, setPlanTier] = useState<string>('free');
  const [paymentBanner, setPaymentBanner] = useState<string | null>(null);
  const [currentAudit, setCurrentAudit] = useState<LeaseAuditSummary | null>(null);

  const fetchUserQuota = async () => {
    try {
      const res = await fetch('/api/billing/quota');
      const json = await res.json();
      if (json.success && json.data) {
        setCreditsRemaining(json.data.freeReportsRemaining ?? 1);
        setPlanTier(json.data.planTier || 'free');
      }
    } catch (err) {
      console.warn('Quota fetch note:', err);
    }
  };

  useEffect(() => {
    fetchUserQuota();

    if (window.location.hash.includes('payment-success')) {
      setPaymentBanner('🎉 Payment Confirmed! Your TenantShield account upgrade has been applied.');
      fetchUserQuota();
      setTimeout(() => setPaymentBanner(null), 8000);
    }
  }, []);

  const scrollToUploader = () => {
    setActiveTab('audit');
    setTimeout(() => {
      const uploaderEl = document.getElementById('lease-uploader-section');
      if (uploaderEl) {
        uploaderEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        creditsRemaining={creditsRemaining}
      />

      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '0 24px 64px 24px' }}>
        {/* Payment Confirmation Banner */}
        {paymentBanner && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '14px',
            padding: '16px 22px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#34d399',
            fontWeight: 700,
            animation: 'fadeIn 0.3s ease',
          }}>
            <ShieldCheck size={22} />
            <span>{paymentBanner}</span>
          </div>
        )}

        {/* System Architecture Telemetry */}
        <HealthStatusBadge />

        {activeTab === 'audit' && (
          <div>
            {currentAudit ? (
              <LeaseAuditViewer
                audit={currentAudit}
                onReset={() => setCurrentAudit(null)}
                onNavigateToDemand={() => setActiveTab('demand')}
              />
            ) : (
              <div>
                <HeroSection onStartAudit={scrollToUploader} />

                {/* Interactive Uploader Section */}
                <div id="lease-uploader-section">
                  <LeaseUploader
                    onAuditCompleted={(audit) => {
                      setCurrentAudit(audit);
                      fetchUserQuota();
                    }}
                    onUpgradeRequested={() => setActiveTab('billing')}
                  />
                </div>

                {/* Architecture Overview Section */}
                <div id="architecture" className="glass-panel" style={{ padding: '38px', marginTop: '48px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
                    <div style={{
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'rgba(99, 102, 241, 0.2)',
                      color: '#818cf8',
                      boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
                    }}>
                      <Cpu size={26} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Engineered for Heavy Legal Documents</h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                        Unlike superficial AI wrappers, TenantShield parses 50+ page leases down into semantic clauses, 
                        cross-references statutory tenant codes, and provides actionable remedies with zero hallucination.
                      </p>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                    marginTop: '26px',
                  }}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '16px',
                      padding: '24px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#60a5fa', marginBottom: '12px' }}>
                        <FileText size={20} />
                        <span style={{ fontWeight: 700, fontSize: '1rem' }}>1. Stream Chunking Engine</span>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        Page-level coordinate extraction with sliding-window clause boundary detection. Prevents context drift and token cutoff on 50+ page PDFs.
                      </p>
                    </div>

                    <div style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '16px',
                      padding: '24px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#34d399', marginBottom: '12px' }}>
                        <Scale size={20} />
                        <span style={{ fontWeight: 700, fontSize: '1rem' }}>2. Statutory Legal Matrix</span>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        Evaluates clauses against California Civil Code § 1950.5, NY HSTPA, Texas Property Code, and Indian Model Tenancy Act.
                      </p>
                    </div>

                    <div style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '16px',
                      padding: '24px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f59e0b', marginBottom: '12px' }}>
                        <Database size={20} />
                        <span style={{ fontWeight: 700, fontSize: '1rem' }}>3. Polyglot Persistence</span>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        PostgreSQL Neon enforces double-entry credit ledger & Stripe transactions; MongoDB stores raw clause ASTs and photo hashes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'vault' && (
          <EvidenceVaultViewer />
        )}

        {activeTab === 'demand' && (
          <DemandNoticeGenerator />
        )}

        {activeTab === 'billing' && (
          <PricingSection
            currentPlanTier={planTier}
            creditsRemaining={creditsRemaining}
            onUpgradeSuccess={fetchUserQuota}
            onNavigateToAudit={() => setActiveTab('audit')}
          />
        )}

        {activeTab === 'system' && (
          <div className="glass-panel" style={{ padding: '38px', marginTop: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '18px' }}>Architecture & Dual-Database Specifications</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '22px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                <h3 style={{ color: '#60a5fa', fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px' }}>PostgreSQL (Neon) Relational Schema</h3>
                <ul style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.6, paddingLeft: '20px' }}>
                  <li><code>users</code> — UUID, email, password hash, role, free_reports_remaining</li>
                  <li><code>subscriptions</code> — stripe_customer_id, plan_tier, billing period status</li>
                  <li><code>credit_transactions</code> — Immutable double-entry financial ledger</li>
                  <li><code>audit_jobs</code> — Document job queue status, page count, exposure metrics</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '22px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                <h3 style={{ color: '#34d399', fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px' }}>MongoDB Document Lake Schema</h3>
                <ul style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.6, paddingLeft: '20px' }}>
                  <li><code>LeaseDocument</code> — Full AST, categorized clauses, statutory citations</li>
                  <li><code>ConditionEvidence</code> — Move-in room photos, SHA-256 tamper-proof timestamps</li>
                  <li><code>DemandLetter</code> — Drafted certified notices with statutory penalty multipliers</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px',
        textAlign: 'center',
        color: 'var(--text-dim)',
        fontSize: '0.85rem',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>🛡️ TenantShield — Next Founders Hackathon 2026</div>
          <div>React + Express + TypeScript + Dual-DB (Neon Postgres & Mongo) + Gemini 2.0</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
