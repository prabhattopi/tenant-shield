import React from 'react';
import { ShieldCheck, FileSearch, ArrowRight, UploadCloud } from 'lucide-react';

interface HeroSectionProps {
  onStartAudit: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartAudit }) => {
  return (
    <div style={{ textAlign: 'center', padding: '48px 0 32px 0' }}>
      {/* Top Banner Tag */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 16px',
        borderRadius: '9999px',
        background: 'rgba(99, 102, 241, 0.1)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        marginBottom: '24px',
      }}>
        <ShieldCheck size={16} color="#818cf8" />
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#c7d2fe' }}>
          Autonomous Legal Defense Against Predatory Leases
        </span>
      </div>

      {/* Main Headline */}
      <h1 style={{
        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
        fontWeight: 800,
        lineHeight: 1.1,
        letterSpacing: '-0.03em',
        maxWidth: '900px',
        margin: '0 auto 20px auto',
        background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        Never Lose Your Security Deposit to Fine Print Again.
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: '1.15rem',
        color: 'var(--text-muted)',
        maxWidth: '680px',
        margin: '0 auto 36px auto',
        lineHeight: 1.6,
      }}>
        TenantShield scans heavy 40+ page rental agreements, detects illegal forfeiture clauses, 
        cites statutory tenant protection codes, and generates certified deposit clawback demand notices.
      </p>

      {/* Call to Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <button
          className="btn-primary"
          style={{ fontSize: '1.05rem', padding: '14px 28px' }}
          onClick={onStartAudit}
        >
          <UploadCloud size={20} />
          Scan Your Lease (1st Free)
          <ArrowRight size={18} />
        </button>

        <a
          href="#architecture"
          className="btn-secondary"
          style={{ fontSize: '1.05rem', padding: '14px 24px' }}
        >
          <FileSearch size={18} />
          How The Engine Works
        </a>
      </div>

      {/* Live Value Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        maxWidth: '900px',
        margin: '56px auto 0 auto',
      }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>$3.2B+</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Unlawfully retained deposits annually in the US
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>48+ Codes</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Statutory legal protections automatically cited
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24' }}>$0 Legal Fees</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Instant AI defense vs $350/hr attorney consultations
          </div>
        </div>
      </div>
    </div>
  );
};
