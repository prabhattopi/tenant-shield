import React, { useState } from 'react';
import { Check, Sparkles, Zap, ShieldCheck, CreditCard } from 'lucide-react';

interface PricingSectionProps {
  currentPlanTier: string;
  creditsRemaining: number;
  onUpgradeSuccess: () => void;
  onNavigateToAudit: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  currentPlanTier,
  creditsRemaining,
  onUpgradeSuccess,
  onNavigateToAudit,
}) => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleStripeCheckout = async (planType: 'audit' | 'pro') => {
    setLoadingPlan(planType);
    try {
      const res = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType,
          userEmail: 'tenant@example.com',
          successUrl: `${window.location.origin}/#payment-success`,
          cancelUrl: `${window.location.origin}/#pricing`,
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.checkoutUrl) {
        // Redirect to real Stripe Checkout (or dev mock URL)
        window.location.href = json.data.checkoutUrl;
      } else {
        alert('Could not initialize checkout. Please check server logs.');
      }
    } catch (err: any) {
      alert(`Checkout error: ${err.message}`);
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleSimulateUpgrade = async (planType: 'audit' | 'pro') => {
    setSimulating(true);
    try {
      const res = await fetch('/api/billing/simulate-upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType }),
      });

      const json = await res.json();
      if (json.success) {
        setToastMessage(`⚡ Instant Upgrade Activated: ${planType === 'pro' ? 'Pro Defender Unlimited' : '+1 Audit Credit Added'}!`);
        onUpgradeSuccess();
        setTimeout(() => setToastMessage(null), 5000);
      }
    } catch (err: any) {
      alert(`Simulation error: ${err.message}`);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '42px 32px', marginTop: '24px' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '12px',
          padding: '14px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#34d399',
          fontWeight: 600,
          animation: 'fadeIn 0.3s ease',
        }}>
          <ShieldCheck size={20} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '38px' }}>
        <div className="badge badge-info" style={{ marginBottom: '12px' }}>
          Stripe Developer Billing Engine
        </div>
        <h2 style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: '10px', color: '#ffffff' }}>
          Affordable, Transparent Defense for Renters
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', maxWidth: '650px', margin: '0 auto' }}>
          Every tenant deserves legal clarity. Start with 1 free comprehensive audit. Upgrade for unlimited scans and certified clawback notices.
        </p>

        {/* Current Entitlement Status Chip */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '30px',
          padding: '8px 20px',
          marginTop: '20px',
          fontSize: '0.88rem',
        }}>
          <span style={{ color: 'var(--text-dim)' }}>Current Status:</span>
          <span style={{ 
            fontWeight: 800, 
            color: currentPlanTier === 'pro' ? '#c084fc' : creditsRemaining > 0 ? '#34d399' : '#f87171' 
          }}>
            {currentPlanTier === 'pro' ? '🛡️ Pro Defender (Unlimited Audits)' : `${creditsRemaining} Free Audit Remaining`}
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
        gap: '24px',
        maxWidth: '1040px',
        margin: '0 auto',
      }}>
        {/* Tier 1: Free Starter */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '32px 28px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>Free Starter</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '18px' }}>Essential inspection for first lease</div>
          
          <div style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '22px', fontFamily: 'var(--font-display)' }}>
            $0
          </div>

          <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '28px', flex: 1 }}>
            <li style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Check size={16} color="#34d399" /> 1 Comprehensive 40+ Page Lease Audit
            </li>
            <li style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Check size={16} color="#34d399" /> Red-Flag Illegal Clause Detection
            </li>
            <li style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Check size={16} color="#34d399" /> Statutory Civil Code References
            </li>
            <li style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-dim)' }}>
              <span style={{ opacity: 0.4 }}>— Certified Demand Letters (Pro only)</span>
            </li>
          </ul>

          <button 
            className="btn-secondary" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={onNavigateToAudit}
          >
            {creditsRemaining > 0 ? 'Use Your Free Audit' : 'Included on Sign-up'}
          </button>
        </div>

        {/* Tier 2: One-Off Audit ($9) */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.06)',
          border: '1px solid rgba(99, 102, 241, 0.45)',
          borderRadius: '20px',
          padding: '32px 28px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          boxShadow: '0 12px 36px rgba(99, 102, 241, 0.18)',
        }}>
          <div style={{
            position: 'absolute',
            top: '-12px',
            right: '24px',
            background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
            color: '#ffffff',
            padding: '3px 12px',
            borderRadius: '20px',
            fontSize: '0.72rem',
            fontWeight: 800,
            boxShadow: '0 0 12px rgba(99, 102, 241, 0.5)',
          }}>
            NO SUBSCRIPTION
          </div>

          <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>Single Deep Audit</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '18px' }}>Pay once per rental agreement</div>
          
          <div style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '22px', fontFamily: 'var(--font-display)' }}>
            $9 <span style={{ fontSize: '0.95rem', color: 'var(--text-dim)', fontWeight: 500 }}>/ lease</span>
          </div>

          <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '28px', flex: 1 }}>
            <li style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Check size={16} color="#34d399" /> Unlimited Pages per Lease
            </li>
            <li style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Check size={16} color="#34d399" /> Side-by-Side Counter-Clause Generator
            </li>
            <li style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Check size={16} color="#34d399" /> Financial Exposure & Penalty Breakdown
            </li>
            <li style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Check size={16} color="#34d399" /> Downloadable Statutory Defense Dossier
            </li>
          </ul>

          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={loadingPlan === 'audit'}
            onClick={() => handleStripeCheckout('audit')}
          >
            <CreditCard size={16} />
            {loadingPlan === 'audit' ? 'Opening Stripe...' : 'Pay $9 via Stripe'}
          </button>
        </div>

        {/* Tier 3: Pro Defender ($4.99/mo) */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.08) 0%, rgba(99, 102, 241, 0.03) 100%)',
          border: currentPlanTier === 'pro' ? '2px solid #a855f7' : '1px solid rgba(168, 85, 247, 0.35)',
          borderRadius: '20px',
          padding: '32px 28px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: '-12px',
            right: '24px',
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            color: '#ffffff',
            padding: '3px 12px',
            borderRadius: '20px',
            fontSize: '0.72rem',
            fontWeight: 800,
            boxShadow: '0 0 12px rgba(168, 85, 247, 0.5)',
          }}>
            RECOMMENDED
          </div>

          <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>TenantShield Pro</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '18px' }}>Complete tenancy clawback shield</div>
          
          <div style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '22px', fontFamily: 'var(--font-display)' }}>
            $4.99 <span style={{ fontSize: '0.95rem', color: 'var(--text-dim)', fontWeight: 500 }}>/ mo</span>
          </div>

          <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '28px', flex: 1 }}>
            <li style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Check size={16} color="#34d399" /> Unlimited Lease Audits & Rescans
            </li>
            <li style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Check size={16} color="#34d399" /> Move-In SHA-256 Photo Vault & Hash
            </li>
            <li style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Check size={16} color="#34d399" /> 1-Click Certified Demand Notice Generator
            </li>
            <li style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Check size={16} color="#34d399" /> Statutory 2x-3x Bad-Faith Multiplier Citer
            </li>
          </ul>

          <button
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
            }}
            disabled={loadingPlan === 'pro' || currentPlanTier === 'pro'}
            onClick={() => handleStripeCheckout('pro')}
          >
            <Sparkles size={16} />
            {currentPlanTier === 'pro' ? 'Active Membership' : loadingPlan === 'pro' ? 'Opening Stripe...' : 'Subscribe ($4.99/mo)'}
          </button>
        </div>
      </div>

      {/* Hackathon Judge / Developer Instant Test Bar */}
      <div style={{
        marginTop: '42px',
        padding: '20px 24px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px dashed var(--border-subtle)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap size={20} color="#f59e0b" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>
              Hackathon Judge Testing Mode (Stripe Sandbox)
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              Test live checkout or activate simulated instant upgrade with 1-click.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            disabled={simulating}
            onClick={() => handleSimulateUpgrade('audit')}
          >
            +1 Credit (Simulate)
          </button>
          <button
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 14px', borderColor: 'rgba(168, 85, 247, 0.5)' }}
            disabled={simulating}
            onClick={() => handleSimulateUpgrade('pro')}
          >
            ⚡ Upgrade to Pro (Simulate)
          </button>
        </div>
      </div>
    </div>
  );
};
