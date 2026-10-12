import React from 'react';
import { Shield, Sparkles, Scale, FileText, Lock } from 'lucide-react';

interface NavbarProps {
  activeTab: 'audit' | 'vault' | 'demand' | 'billing' | 'system';
  setActiveTab: (tab: 'audit' | 'vault' | 'demand' | 'billing' | 'system') => void;
  creditsRemaining: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, creditsRemaining }) => {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'var(--glass-blur)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0 24px',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
      }}>
        {/* Logo and Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('audit')}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
          }}>
            <Shield size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
                Tenant<span style={{ color: '#818cf8' }}>Shield</span>
              </span>
              <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>AI 2.0</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', letterSpacing: '0.01em' }}>
              Lease Defender & Deposit Clawback
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setActiveTab('audit')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'audit' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              color: activeTab === 'audit' ? '#a5b4fc' : 'var(--text-muted)',
              transition: 'var(--transition-smooth)',
            }}
          >
            <Scale size={16} />
            Lease Audit
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'vault' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              color: activeTab === 'vault' ? '#a5b4fc' : 'var(--text-muted)',
              transition: 'var(--transition-smooth)',
            }}
          >
            <Lock size={16} />
            Evidence Vault
          </button>

          <button
            onClick={() => setActiveTab('demand')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'demand' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              color: activeTab === 'demand' ? '#a5b4fc' : 'var(--text-muted)',
              transition: 'var(--transition-smooth)',
            }}
          >
            <FileText size={16} />
            Demand Letters
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'billing' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              color: activeTab === 'billing' ? '#a5b4fc' : 'var(--text-muted)',
              transition: 'var(--transition-smooth)',
            }}
          >
            <Sparkles size={16} />
            Pricing
          </button>

          <button
            onClick={() => setActiveTab('system')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'system' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              color: activeTab === 'system' ? '#a5b4fc' : 'var(--text-muted)',
              transition: 'var(--transition-smooth)',
            }}
          >
            System Status
          </button>
        </nav>

        {/* Right Action: Free Credit counter & upgrade */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '6px 12px',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.82rem',
          }}>
            <span style={{ color: 'var(--text-dim)' }}>Audits Left:</span>
            <span style={{ fontWeight: 700, color: creditsRemaining > 0 ? '#34d399' : '#f87171' }}>
              {creditsRemaining} Free
            </span>
          </div>

          <button
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={() => setActiveTab('billing')}
          >
            <Sparkles size={14} />
            Upgrade Pro
          </button>
        </div>
      </div>
    </header>
  );
};
