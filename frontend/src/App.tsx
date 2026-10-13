import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HealthStatusBadge } from './components/HealthStatusBadge';
import { Scale, Database, Cpu, Lock, FileText, Camera, ShieldCheck, MailCheck, Check, Sparkles } from 'lucide-react';

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
        {/* System Architecture Telemetry */}
        <HealthStatusBadge />

        {activeTab === 'audit' && (
          <div>
            <HeroSection onStartAudit={() => setActiveTab('audit')} />

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

        {activeTab === 'vault' && (
          <div className="glass-panel" style={{ padding: '48px 36px', textAlign: 'center', marginTop: '24px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'rgba(168, 85, 247, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)',
            }}>
              <Lock size={32} color="#c084fc" />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <span className="badge badge-coming-soon">
                <span className="beacon-dot-purple"></span> Coming Soon
              </span>
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px', color: '#ffffff' }}>
              Move-In / Move-Out Evidence Vault
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto 32px auto', fontSize: '0.98rem' }}>
              Upload room inspection photos upon moving in. Each image is stamped with an immutable SHA-256 hash, 
              EXIF verification, and ISO timestamp to defeat fraudulent landlord damage claims upon move-out.
            </p>

            {/* Feature Teasers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '18px',
              maxWidth: '850px',
              margin: '0 auto',
              textAlign: 'left',
            }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                <Camera size={20} color="#c084fc" style={{ marginBottom: '8px' }} />
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>Room Tagging & Defect Pinning</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.84rem', marginTop: '4px' }}>
                  Tag walls, carpets, fixtures, and appliances with pre-existing defect notes.
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                <ShieldCheck size={20} color="#34d399" style={{ marginBottom: '8px' }} />
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>Tamper-Proof SHA-256 Hashes</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.84rem', marginTop: '4px' }}>
                  Cryptographic hashing guarantees images haven't been altered or backdated.
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                <FileText size={20} color="#38bdf8" style={{ marginBottom: '8px' }} />
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>Certified Move-Out Certificate</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.84rem', marginTop: '4px' }}>
                  Export court-ready condition audit certificates to refute deposit deductions.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'demand' && (
          <div className="glass-panel" style={{ padding: '48px 36px', textAlign: 'center', marginTop: '24px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)',
            }}>
              <MailCheck size={32} color="#34d399" />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <span className="badge badge-coming-soon">
                <span className="beacon-dot-purple"></span> Coming Soon
              </span>
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px', color: '#ffffff' }}>
              1-Click Certified Clawback Demand Letters
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto 32px auto', fontSize: '0.98rem' }}>
              Generate statutory demand letters citing mandatory deadlines and bad-faith penalty multipliers 
              (e.g., 2x to 3x statutory damages) to compel immediate return of your security deposit.
            </p>

            {/* Feature Teasers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '18px',
              maxWidth: '850px',
              margin: '0 auto',
              textAlign: 'left',
            }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                <Scale size={20} color="#34d399" style={{ marginBottom: '8px' }} />
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>Statutory Code Citation</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.84rem', marginTop: '4px' }}>
                  Auto-inserts relevant tenancy laws, notice periods, and statutory penalty sections.
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                <Check size={20} color="#818cf8" style={{ marginBottom: '8px' }} />
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>Line-Item Dispute Breakdown</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.84rem', marginTop: '4px' }}>
                  Disputes bogus charges (cleaning, paint, repainting) item-by-item with legal grounds.
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                <Sparkles size={20} color="#f59e0b" style={{ marginBottom: '8px' }} />
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>Ready to Mail / Email</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.84rem', marginTop: '4px' }}>
                  Formatted as formal attorney-grade demand notice ready to send via certified mail or PDF.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="glass-panel" style={{ padding: '42px 36px', marginTop: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '38px' }}>
              <div className="badge badge-info" style={{ marginBottom: '12px' }}>Next Founders Hackathon Model</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '10px' }}>Predictable Pricing for Tenants</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Your first lease audit is 100% free with no credit card required. Pay-as-you-go or upgrade for complete tenancy protection.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              maxWidth: '920px',
              margin: '0 auto',
            }}>
              {/* Free Tier */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '18px',
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>Free Audit</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '18px' }}>For first-time renters</div>
                <div style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '22px', fontFamily: 'var(--font-display)' }}>$0</div>
                <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '26px', flex: 1 }}>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#34d399" /> 1 Full Lease Audit (up to 40 pages)</li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#34d399" /> Red-flag illegal clause detection</li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#34d399" /> Overall Risk Score (0–100)</li>
                </ul>
                <button className="btn-secondary" style={{ width: '100%' }}>Included on Sign Up</button>
              </div>

              {/* Pay-Per-Report */}
              <div style={{
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                borderRadius: '18px',
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: '0 10px 30px rgba(99, 102, 241, 0.2)',
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '20px',
                }} className="badge badge-info">Popular</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>One-Off Audit</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '18px' }}>Single contract deep-dive</div>
                <div style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '22px', fontFamily: 'var(--font-display)' }}>
                  $9 <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>/ lease</span>
                </div>
                <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '26px', flex: 1 }}>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#34d399" /> Unlimited pages per lease</li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#34d399" /> Detailed statutory legal citations</li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#34d399" /> Safe counter-clause generator</li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#34d399" /> Exportable PDF audit report</li>
                </ul>
                <button className="btn-primary" style={{ width: '100%' }}>Purchase Audit via Stripe</button>
              </div>

              {/* Pro Membership */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '18px',
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>Tenant Shield Pro</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '18px' }}>Full tenancy protection</div>
                <div style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '22px', fontFamily: 'var(--font-display)' }}>
                  $4.99 <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>/ month</span>
                </div>
                <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '26px', flex: 1 }}>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#34d399" /> Unlimited lease audits</li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#34d399" /> Move-In SHA-256 Photo Vault</li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#34d399" /> 1-Click Clawback Demand Letters</li>
                  <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#34d399" /> Direct attorney-ready exports</li>
                </ul>
                <button className="btn-secondary" style={{ width: '100%' }}>Subscribe with Stripe</button>
              </div>
            </div>
          </div>
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
