import React, { useEffect, useState } from 'react';
import { Database, Cpu, CreditCard, Activity, AlertTriangle, RefreshCw } from 'lucide-react';
import { SystemHealthData } from '../types';

export const HealthStatusBadge: React.FC = () => {
  const [health, setHealth] = useState<SystemHealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      if (json.success) {
        setHealth(json.data);
      } else {
        throw new Error('API returned unsuccessful health check');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reach API gateway');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel" style={{ padding: '24px', margin: '24px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={20} color="#818cf8" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Dual-Database & System Architecture Health</h3>
        </div>
        <button
          onClick={fetchHealth}
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'pulse-glow' : ''} />
          Refresh
        </button>
      </div>

      {error ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: '8px',
          color: '#fda4af',
          fontSize: '0.9rem',
        }}>
          <AlertTriangle size={18} />
          <span>Gateway Offline: {error} (Ensure backend server is running on port 5000)</span>
        </div>
      ) : health ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}>
          {/* Relational DB (Postgres / Neon) */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <Database size={16} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>PostgreSQL (Neon)</span>
              </div>
              <span className={`badge ${health.databases.relational.connected ? 'badge-success' : 'badge-info'}`}>
                {health.databases.relational.mode}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              Users, Subscriptions, Ledger
            </div>
          </div>

          {/* Document Lake (MongoDB) */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <Database size={16} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>MongoDB</span>
              </div>
              <span className={`badge ${health.databases.documentStore.connected ? 'badge-success' : 'badge-info'}`}>
                {health.databases.documentStore.mode}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              Lease AST, Raw Clauses, Evidence
            </div>
          </div>

          {/* LLM Engine Adapter */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <Cpu size={16} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Pluggable LLM</span>
              </div>
              <span className="badge badge-success">
                {health.llm.activeProvider}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              {health.llm.geminiKeyConfigured ? 'Gemini 1.5/2.0 API Key Live' : 'Resilient Analyzer Active'}
            </div>
          </div>

          {/* Billing Engine (Stripe) */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <CreditCard size={16} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Stripe Billing</span>
              </div>
              <span className="badge badge-info">
                {health.billing.mode}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              1st Report Free • Paywall Enabled
            </div>
          </div>
        </div>
      ) : (
        <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Connecting to system bus...</div>
      )}
    </div>
  );
};
