import React from 'react';
import { Shield, Sparkles, Scale, FileText, Lock, Activity } from 'lucide-react';

interface NavbarProps {
  activeTab: 'audit' | 'vault' | 'demand' | 'billing' | 'system';
  setActiveTab: (tab: 'audit' | 'vault' | 'demand' | 'billing' | 'system') => void;
  creditsRemaining: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, creditsRemaining }) => {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(5, 7, 14, 0.88)',
      backdropFilter: 'var(--glass-blur)',
      WebkitBackdropFilter: 'var(--glass-blur)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0 20px',
    }}>
      <div style={{
        maxWidth: '1320px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '66px',
        gap: '16px',
      }}>
        {/* Brand Logo & Name (Crisp & Single Line) */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }} 
          onClick={() => setActiveTab('audit')}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.45)',
          }}>
            <Shield size={20} color="#ffffff" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              fontSize: '1.2rem', 
              fontWeight: 800, 
              fontFamily: 'var(--font-display)', 
              letterSpacing: '-0.02em', 
              color: '#ffffff' 
            }}>
              Tenant<span style={{ color: '#818cf8' }}>Shield</span>
            </span>
            <span className="badge badge-info" style={{ fontSize: '0.62rem', padding: '2px 6px', fontWeight: 700 }}>
              AI 2.0
            </span>
          </div>
        </div>

        {/* Navigation Tabs (Sleek Segmented Pill Group) */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          overflowX: 'auto',
        }}>
          <button
            onClick={() => setActiveTab('audit')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 13px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 600,
              border: activeTab === 'audit' ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              background: activeTab === 'audit' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeTab === 'audit' ? '#ffffff' : 'var(--text-muted)',
              transition: 'var(--transition-smooth)',
              whiteSpace: 'nowrap',
            }}
          >
            <Scale size={15} color={activeTab === 'audit' ? '#818cf8' : 'currentColor'} />
            Lease Audit
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 13px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 600,
              border: activeTab === 'vault' ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              background: activeTab === 'vault' ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
              color: activeTab === 'vault' ? '#ffffff' : 'var(--text-muted)',
              transition: 'var(--transition-smooth)',
              whiteSpace: 'nowrap',
            }}
          >
            <Lock size={15} color={activeTab === 'vault' ? '#c084fc' : 'currentColor'} />
            <span>Evidence Vault</span>
          </button>

          <button
            onClick={() => setActiveTab('demand')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 13px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 600,
              border: activeTab === 'demand' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              background: activeTab === 'demand' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: activeTab === 'demand' ? '#ffffff' : 'var(--text-muted)',
              transition: 'var(--transition-smooth)',
              whiteSpace: 'nowrap',
            }}
          >
            <FileText size={15} color={activeTab === 'demand' ? '#34d399' : 'currentColor'} />
            <span>Demand Notices</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 13px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 600,
              border: activeTab === 'billing' ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              background: activeTab === 'billing' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeTab === 'billing' ? '#ffffff' : 'var(--text-muted)',
              transition: 'var(--transition-smooth)',
              whiteSpace: 'nowrap',
            }}
          >
            <Sparkles size={15} color={activeTab === 'billing' ? '#818cf8' : 'currentColor'} />
            Pricing
          </button>

          <button
            onClick={() => setActiveTab('system')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 13px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 600,
              border: activeTab === 'system' ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              background: activeTab === 'system' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeTab === 'system' ? '#ffffff' : 'var(--text-muted)',
              transition: 'var(--transition-smooth)',
              whiteSpace: 'nowrap',
            }}
          >
            <Activity size={15} color={activeTab === 'system' ? '#818cf8' : 'currentColor'} />
            System Status
          </button>
        </nav>

        {/* Right Section: Free Audit Credits & Upgrade CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.035)',
            padding: '6px 12px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
          }}>
            <span className="beacon-dot" style={{ width: '6px', height: '6px' }}></span>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>Credits:</span>
            <span style={{ fontWeight: 800, color: creditsRemaining > 0 ? '#34d399' : '#f87171' }}>
              {creditsRemaining} Free
            </span>
          </div>

          <button
            className="btn-primary"
            style={{ padding: '7px 14px', fontSize: '0.82rem', borderRadius: '10px' }}
            onClick={() => setActiveTab('billing')}
          >
            <Sparkles size={13} />
            Upgrade Pro
          </button>
        </div>
      </div>
    </header>
  );
};
