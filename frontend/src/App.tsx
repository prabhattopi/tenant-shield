import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HealthStatusBadge } from './components/HealthStatusBadge';
import { Scale, Database, Cpu, Lock, FileText } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'audit' | 'vault' | 'demand' | 'billing' | 'system'>('audit');
  const [creditsRemaining] = useState<number>(1);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        creditsRemaining={creditsRemaining}
      />

      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '0 24px 64px 24px' }}>
        {/* System Architecture Badge is visible across tabs */}
        <HealthStatusBadge />

        {activeTab === 'audit' && (
          <div>
            <HeroSection onStartAudit={() => setActiveTab('audit')} />

            {/* Architecture Overview Section */}
            <div id="architecture" className="glass-panel" style={{ padding: '36px', marginTop: '48px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'rgba(99, 102, 241, 0.2)',
                  color: '#818cf8',
                }}>
                  <Cpu size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Engineered for Heavy Legal Documents</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Unlike superficial AI wrappers, TenantShield breaks 50+ page leases down into semantic clauses, 
                    cross-references state statutes, and generates legally binding remedies.
                  </p>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                marginTop: '24px',
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', marginBottom: '10px' }}>
                    <FileText size={18} />
                    <span style={{ fontWeight: 700 }}>1. Stream Chunking Engine</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Page-level coordinate extraction with sliding-window clause boundary detection. Prevents context drift on 50+ page PDFs.
                  </p>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', marginBottom: '10px' }}>
                    <Scale size={18} />
                    <span style={{ fontWeight: 700 }}>2. Statutory Legal Matrix</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Evaluates clauses against California Civil Code § 1950.5, NY HSTPA, Texas Property Code, and Indian Model Tenancy Act.
                  </p>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', marginBottom: '10px' }}>
                    <Database size={18} />
                    <span style={{ fontWeight: 700 }}>3. Polyglot Persistence</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    PostgreSQL Neon enforces double-entry credit ledger & Stripe transactions; MongoDB stores raw clause ASTs and photo hashes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vault' && (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', marginTop: '24px' }}>
            <Lock size={48} color="#818cf8" style={{ marginBottom: '16px' }} />
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>Move-In/Move-Out Evidence Vault</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 24px auto' }}>
              Upload room inspection photos upon moving in. Each image is stamped with an immutable SHA-256 hash and ISO timestamp to defeat fraudulent landlord damage claims upon move-out.
            </p>
            <div className="badge badge-info" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              Phase 4 Feature Module — Scaffolding Active
            </div>
          </div>
        )}

        {activeTab === 'demand' && (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', marginTop: '24px' }}>
            <FileText size={48} color="#34d399" style={{ marginBottom: '16px' }} />
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>Certified Clawback Demand Notices</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 24px auto' }}>
              Generate statutory demand letters with legally cited bad-faith penalty calculations (e.g., 2x statutory damages under Cal. Civ. Code § 1950.5(l)).
            </p>
            <div className="badge badge-success" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              Phase 4 Feature Module — Scaffolding Active
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="glass-panel" style={{ padding: '40px', marginTop: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div className="badge badge-info" style={{ marginBottom: '12px' }}>Next Founders Hackathon Model</div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>Predictable Pricing for Tenants</h2>
              <p style={{ color: 'var(--text-muted)' }}>
                First lease audit is 100% free. Pay-as-you-go or subscribe for ongoing tenancy protection.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              maxWidth: '900px',
              margin: '0 auto',
            }}>
              {/* Free Tier */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>Free Audit</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '16px' }}>For first-time renters</div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '20px' }}>$0</div>
                <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', flex: 1 }}>
                  <li style={{ marginBottom: '10px' }}>✓ 1 Full Lease Audit (up to 40 pages)</li>
                  <li style={{ marginBottom: '10px' }}>✓ Red-flag illegal clause detection</li>
                  <li style={{ marginBottom: '10px' }}>✓ Overall Risk Score (0–100)</li>
                </ul>
                <button className="btn-secondary" style={{ width: '100%' }}>Included on Sign Up</button>
              </div>

              {/* Pay-Per-Report */}
              <div style={{
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                borderRadius: '16px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '20px',
                }} className="badge badge-info">Popular</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>One-Off Audit</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '16px' }}>Single contract deep-dive</div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '20px' }}>$9 <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>/ lease</span></div>
                <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', flex: 1 }}>
                  <li style={{ marginBottom: '10px' }}>✓ Unlimited pages per lease</li>
                  <li style={{ marginBottom: '10px' }}>✓ Detailed statutory legal citations</li>
                  <li style={{ marginBottom: '10px' }}>✓ Safe counter-clause generator</li>
                  <li style={{ marginBottom: '10px' }}>✓ Exportable PDF audit report</li>
                </ul>
                <button className="btn-primary" style={{ width: '100%' }}>Purchase Audit via Stripe</button>
              </div>

              {/* Pro Membership */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>Tenant Shield Pro</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '16px' }}>Full tenancy protection</div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '20px' }}>$4.99 <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>/ month</span></div>
                <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', flex: 1 }}>
                  <li style={{ marginBottom: '10px' }}>✓ Unlimited lease audits</li>
                  <li style={{ marginBottom: '10px' }}>✓ Move-In SHA-256 Photo Vault</li>
                  <li style={{ marginBottom: '10px' }}>✓ 1-Click Clawback Demand Letters</li>
                  <li style={{ marginBottom: '10px' }}>✓ Direct attorney-ready exports</li>
                </ul>
                <button className="btn-secondary" style={{ width: '100%' }}>Subscribe with Stripe</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="glass-panel" style={{ padding: '36px', marginTop: '24px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px' }}>Architecture & Dual-Database Specifications</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px' }}>
                <h3 style={{ color: '#60a5fa', fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px' }}>PostgreSQL (Neon) Relational Schema</h3>
                <ul style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, paddingLeft: '20px' }}>
                  <li><code>users</code> — UUID, email, hashed credentials, free_reports_remaining</li>
                  <li><code>subscriptions</code> — stripe_customer_id, plan_tier, billing period</li>
                  <li><code>credit_transactions</code> — Immutable double-entry financial ledger</li>
                  <li><code>audit_jobs</code> — Document job queue status, page count, exposure metrics</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px' }}>
                <h3 style={{ color: '#34d399', fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px' }}>MongoDB Document Lake Schema</h3>
                <ul style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, paddingLeft: '20px' }}>
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
          <div>🛡️ TenantShield — Built for Next Founders Hackathon 2026</div>
          <div>React + Express + TypeScript + Dual-DB (Neon Postgres & Mongo) + Gemini 2.0</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
