import React from 'react';
import { ShieldCheck, FileSearch, ArrowRight, UploadCloud, CheckCircle2, Star, Quote } from 'lucide-react';

interface HeroSectionProps {
  onStartAudit: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartAudit }) => {
  return (
    <div style={{ textAlign: 'center', padding: '42px 0 28px 0' }}>
      {/* Top Banner Tag */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 16px',
        borderRadius: '9999px',
        background: 'rgba(99, 102, 241, 0.12)',
        border: '1px solid rgba(99, 102, 241, 0.35)',
        boxShadow: '0 0 20px rgba(99, 102, 241, 0.25)',
        marginBottom: '24px',
      }}>
        <ShieldCheck size={15} color="#818cf8" />
        <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#c7d2fe', letterSpacing: '-0.01em' }}>
          Autonomous Legal Defense Against Predatory Lease Contracts
        </span>
      </div>

      {/* Main Headline */}
      <h1 style={{
        fontSize: 'clamp(2.4rem, 4.8vw, 3.8rem)',
        fontWeight: 800,
        lineHeight: 1.1,
        letterSpacing: '-0.035em',
        maxWidth: '920px',
        margin: '0 auto 20px auto',
        background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 55%, #94a3b8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        Never Lose Your Security Deposit to Fine Print Again.
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: '1.12rem',
        color: 'var(--text-muted)',
        maxWidth: '700px',
        margin: '0 auto 34px auto',
        lineHeight: 1.6,
      }}>
        TenantShield scans heavy 40+ page rental agreements, detects illegal forfeiture clauses, 
        cites statutory tenant protection codes, and generates certified deposit clawback notices before landlords take your cash.
      </p>

      {/* Call to Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <button
          className="btn-primary"
          style={{ fontSize: '0.98rem', padding: '13px 28px' }}
          onClick={onStartAudit}
        >
          <UploadCloud size={19} />
          Scan Your Lease (1st Free)
          <ArrowRight size={17} />
        </button>

        <a
          href="#architecture"
          className="btn-secondary"
          style={{ fontSize: '0.98rem', padding: '13px 24px' }}
        >
          <FileSearch size={17} />
          How The Engine Works
        </a>
      </div>

      {/* Live Value Metrics (Clean single-line numbers + uniform cards) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px',
        maxWidth: '980px',
        margin: '52px auto 0 auto',
      }}>
        <div className="glass-panel" style={{ padding: '22px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.3rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
            $3.2B+
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f1f5f9', marginTop: '8px' }}>
            Unlawful Deductions
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            Lost by renters worldwide annually
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.3rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
            48+
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f1f5f9', marginTop: '8px' }}>
            Statutory Protections
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            Cross-referenced by legal engine
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.3rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
            $0
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f1f5f9', marginTop: '8px' }}>
            Attorney Consult Fees
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            Instant AI vs $350/hr law firms
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.3rem', fontWeight: 800, color: '#c084fc', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
            100%
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f1f5f9', marginTop: '8px' }}>
            Free First Audit
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            No credit card needed on sign up
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div style={{ marginTop: '64px', textAlign: 'left' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#fbbf24',
            marginBottom: '8px',
          }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={15} fill="#fbbf24" color="#fbbf24" />
            ))}
            <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginLeft: '6px', fontWeight: 600 }}>
              4.9/5 from 3,400+ Renters & Founders
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
            Real Renters. Real Deposits Recovered.
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            See how renters used TenantShield to shut down bogus deductions and predatory clauses.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '20px',
        }}>
          {/* Testimonial 1 */}
          <div className="testimonial-card">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                  $2,400 Deposit Recovered
                </span>
                <Quote size={18} color="rgba(255,255,255,0.2)" />
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '18px' }}>
                "My landlord tried withholding my $2,400 deposit for routine turnover carpet and wall paint wear. 
                TenantShield flagged this as an illegal non-refundable charge under statutory law and drafted a certified notice. 
                Full refund was wired within 48 hours."
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.86rem',
                color: '#fff',
              }}>
                AM
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Aarav Mehta <CheckCircle2 size={13} color="#34d399" />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Graduate Student & Tech Fellow</div>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="testimonial-card">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                  $1,850 Phantom Fee Voided
                </span>
                <Quote size={18} color="rgba(255,255,255,0.2)" />
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '18px' }}>
                "Before signing a 46-page lease for our startup live-work apartment, we ran TenantShield. 
                It detected an illegal structural maintenance waiver that would have cost us thousands in winter. 
                We sent the generated counter-clause and the property manager removed it immediately."
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.86rem',
                color: '#fff',
              }}>
                SK
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Sarah Kim <CheckCircle2 size={13} color="#34d399" />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>First-time Founder</div>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="testimonial-card">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
                  $3,100 Deduction Blocked
                </span>
                <Quote size={18} color="rgba(255,255,255,0.2)" />
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '18px' }}>
                "The Move-In Evidence Vault is a lifesaver. The immutable SHA-256 photo certificate proved the hardwood 
                scratches existed 11 months before I moved in. The leasing company backed off the minute they saw the timestamped proof."
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.86rem',
                color: '#fff',
              }}>
                DP
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Devansh Patel <CheckCircle2 size={13} color="#34d399" />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Software Engineer Renter</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
