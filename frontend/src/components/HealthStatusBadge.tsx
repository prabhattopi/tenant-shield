import React, { useEffect, useState, useRef } from 'react';
import { Database, Cpu, CreditCard, Activity, AlertTriangle, RefreshCw } from 'lucide-react';
import { SystemHealthData } from '../types';

export const HealthStatusBadge: React.FC = () => {
  const [health, setHealth] = useState<SystemHealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef<boolean>(false);

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
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchHealth();
    }
  }, []);

  // Format mode string into short, readable badge
  const formatMode = (connected: boolean, mode: string) => {
    if (connected) return { label: 'Live Cloud', badgeClass: 'badge-success' };
    if (mode.includes('in_memory')) return { label: 'Local Dev', badgeClass: 'badge-warning' };
    return { label: mode.toUpperCase(), badgeClass: 'badge-info' };
  };

  return (
    <div className="glass-panel" style={{ padding: '20px 24px', margin: '20px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={18} color="#818cf8" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>System & Database Architecture Telemetry</h3>
        </div>
        <button
          onClick={fetchHealth}
          className="btn-secondary"
          style={{ padding: '6px 14px', fontSize: '0.78rem', height: '32px' }}
          disabled={loading}
        >
          <RefreshCw size={13} className={loading ? 'pulse-glow' : ''} />
          {loading ? 'Checking...' : 'Refresh Status'}
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
          borderRadius: '10px',
          color: '#fda4af',
          fontSize: '0.86rem',
        }}>
          <AlertTriangle size={16} />
          <span>Gateway Offline: {error} (Ensure backend server is running on port 5000)</span>
        </div>
      ) : health ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '14px',
        }}>
          {/* Relational DB (Postgres / Neon) */}
          {(() => {
            const relMode = formatMode(health.databases.relational.connected, health.databases.relational.mode);
            return (
              <div style={{
                background: 'rgba(255, 255, 255, 0.025)',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    <Database size={15} color="#818cf8" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9' }}>PostgreSQL (Neon)</span>
                  </div>
                  <span className={`badge ${relMode.badgeClass}`} style={{ fontSize: '0.68rem', padding: '3px 8px', whiteSpace: 'nowrap' }}>
                    {relMode.label}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Users, Subscriptions, Ledger
                </div>
              </div>
            );
          })()}

          {/* Document Lake (MongoDB) */}
          {(() => {
            const docMode = formatMode(health.databases.documentStore.connected, health.databases.documentStore.mode);
            return (
              <div style={{
                background: 'rgba(255, 255, 255, 0.025)',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    <Database size={15} color="#34d399" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9' }}>MongoDB Atlas</span>
                  </div>
                  <span className={`badge ${docMode.badgeClass}`} style={{ fontSize: '0.68rem', padding: '3px 8px', whiteSpace: 'nowrap' }}>
                    {docMode.label}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Lease AST, Raw Clauses, Evidence
                </div>
              </div>
            );
          })()}

          {/* LLM Engine Adapter */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.025)',
            padding: '14px 16px',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <Cpu size={15} color="#38bdf8" />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9' }}>Pluggable LLM</span>
              </div>
              <span className={`badge ${health.llm.geminiKeyConfigured ? 'badge-success' : 'badge-info'}`} style={{ fontSize: '0.68rem', padding: '3px 8px', whiteSpace: 'nowrap' }}>
                {health.llm.geminiKeyConfigured ? 'Gemini Live' : 'Gemini Ready'}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              {health.llm.geminiKeyConfigured ? 'Google Gemini 1.5/2.0 API Active' : 'Resilient Analyzer Active'}
            </div>
          </div>

          {/* Billing Engine (Stripe) */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.025)',
            padding: '14px 16px',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <CreditCard size={15} color="#c084fc" />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9' }}>Stripe Billing</span>
              </div>
              <span className={`badge ${health.billing.stripeConfigured ? 'badge-success' : 'badge-info'}`} style={{ fontSize: '0.68rem', padding: '3px 8px', whiteSpace: 'nowrap' }}>
                {health.billing.stripeConfigured ? 'Test Live' : 'Dev Sandbox'}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              1st Report Free • Paywall Ready
            </div>
          </div>
        </div>
      ) : (
        <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Connecting to system bus...</div>
      )}
    </div>
  );
};
