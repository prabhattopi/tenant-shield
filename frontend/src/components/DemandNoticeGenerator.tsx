import React, { useState } from 'react';
import { 
  Scale, 
  Sparkles, 
  Copy, 
  Check, 
  Printer, 
  Download, 
  Plus, 
  Trash2, 
  MailCheck 
} from 'lucide-react';

interface DisputedItem {
  item: string;
  amount: number;
  reason: string;
}

export const DemandNoticeGenerator: React.FC = () => {
  const [jurisdictionState, setJurisdictionState] = useState<string>('California');
  const [tenantName, setTenantName] = useState<string>('Alex Mercer');
  const [landlordName, setLandlordName] = useState<string>('Apex Property Management LLC');
  const [landlordAddress, setLandlordAddress] = useState<string>('100 Grand Avenue, Suite 400, Oakland, CA 94612');
  const [rentalAddress, setRentalAddress] = useState<string>('Unit 4B, 742 Evergreen Terrace, Berkeley, CA 94704');
  const [leaseEndDate, setLeaseEndDate] = useState<string>('2026-09-30');
  const [totalDepositPaid, setTotalDepositPaid] = useState<number>(2400);

  const [disputedDeductions, setDisputedDeductions] = useState<DisputedItem[]>([
    {
      item: 'Mandatory Turnover Cleaning Fee',
      amount: 450,
      reason: 'Unlawful under Cal. Civ. Code § 1950.5(m). Unit returned broom-clean; non-refundable turnover fees are statutorily void.',
    },
    {
      item: 'Full Wall Repainting Deduction',
      amount: 400,
      reason: 'Ordinary wear and tear after 24-month tenancy. Non-deductible under Cal. Civ. Code § 1950.5(e).',
    },
  ]);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Total disputed calculation
  const totalWithheld = disputedDeductions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const badFaithPenalty = totalWithheld * 2;
  const totalCourtExposure = totalWithheld + badFaithPenalty;

  const handleAddItem = () => {
    setDisputedDeductions(prev => [
      ...prev,
      { item: '', amount: 0, reason: '' },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setDisputedDeductions(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateItem = (index: number, field: keyof DisputedItem, value: any) => {
    setDisputedDeductions(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const loadSampleCaliforniaDispute = async () => {
    try {
      setIsGenerating(true);
      const res = await fetch('/api/demand/sample');
      const json = await res.json();
      if (json.success && json.data) {
        setTenantName(json.data.tenantName);
        setLandlordName(json.data.landlordName);
        setLandlordAddress(json.data.landlordAddress);
        setRentalAddress(json.data.rentalAddress);
        setTotalDepositPaid(json.data.totalDepositPaid);
        setGeneratedLetter(json.data.letterMarkdown);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateNotice = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/demand/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jurisdictionState,
          tenantName,
          landlordName,
          landlordAddress,
          rentalAddress,
          leaseEndDate,
          totalDepositPaid,
          unlawfullyWithheldAmount: totalWithheld,
          disputedDeductions,
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.letterMarkdown) {
        setGeneratedLetter(json.data.letterMarkdown);
      } else {
        alert(json.message || 'Failed to generate demand letter');
      }
    } catch (err: any) {
      alert(`Generation error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedLetter) return;
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    if (!generatedLetter) return;
    const blob = new Blob([generatedLetter], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Security_Deposit_Demand_Notice_${tenantName.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '36px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div className="badge badge-success" style={{ marginBottom: '10px' }}>
              <Scale size={14} /> Statutory Clawback Engine
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              Certified Security Deposit Demand Notice Generator
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', maxWidth: '680px' }}>
              Compel dishonest landlords to return illegally withheld deposits. Cites mandatory statutory deadlines, 
              bad-faith damages (up to 2x statutory penalties), and small claims court exposure.
            </p>
          </div>

          <button
            className="btn-secondary"
            style={{ fontSize: '0.85rem' }}
            onClick={loadSampleCaliforniaDispute}
          >
            <Sparkles size={15} color="#34d399" />
            Load Sample $850 Deposit Dispute
          </button>
        </div>

        {/* Financial Penalty Exposure Banner */}
        <div style={{
          marginTop: '26px',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          padding: '20px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          <div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
              Unlawfully Withheld Funds
            </div>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
              ${totalWithheld.toLocaleString()}
            </div>
          </div>

          <div>
            <div style={{ color: '#fca5a5', fontSize: '0.78rem', textTransform: 'uppercase' }}>
              Statutory 2x Penalty (Bad Faith)
            </div>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#f87171', marginTop: '4px' }}>
              +${badFaithPenalty.toLocaleString()}
            </div>
          </div>

          <div>
            <div style={{ color: '#34d399', fontSize: '0.78rem', textTransform: 'uppercase' }}>
              Total Potential Small Claims Claim
            </div>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
              ${totalCourtExposure.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: generatedLetter ? '1fr 1fr' : '1fr', gap: '28px' }}>
        {/* Left Column: Generator Form */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', color: '#ffffff' }}>
            Dispute Parameters & Landlord Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '6px' }}>
                Tenant Full Name
              </label>
              <input
                type="text"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '6px' }}>
                Jurisdiction
              </label>
              <select
                value={jurisdictionState}
                onChange={(e) => setJurisdictionState(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                }}
              >
                <option value="California">California (Civ. Code § 1950.5)</option>
                <option value="New York">New York (HSTPA § 7-108)</option>
                <option value="Texas">Texas (Prop. Code § 92.109)</option>
                <option value="Washington">Washington (RCW 59.18.280)</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '6px' }}>
              Rental Property Address
            </label>
            <input
              type="text"
              value={rentalAddress}
              onChange={(e) => setRentalAddress(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: '0.88rem',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '6px' }}>
              Landlord / Property Manager Name
            </label>
            <input
              type="text"
              value={landlordName}
              onChange={(e) => setLandlordName(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: '0.88rem',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '6px' }}>
                Total Deposit Paid ($)
              </label>
              <input
                type="number"
                value={totalDepositPaid}
                onChange={(e) => setTotalDepositPaid(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '6px' }}>
                Move-Out / Lease End Date
              </label>
              <input
                type="date"
                value={leaseEndDate}
                onChange={(e) => setLeaseEndDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '6px' }}>
              Landlord Formal Mailing Address
            </label>
            <input
              type="text"
              value={landlordAddress}
              onChange={(e) => setLandlordAddress(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: '0.88rem',
              }}
            />
          </div>

          {/* Disputed Deductions List */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontWeight: 700, fontSize: '0.92rem', color: '#ffffff' }}>
                Disputed Deductions ({disputedDeductions.length})
              </label>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                onClick={handleAddItem}
              >
                <Plus size={13} /> Add Line Item
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {disputedDeductions.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '14px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      placeholder="e.g. Unlawful Turnover Cleaning"
                      value={item.item}
                      onChange={(e) => handleUpdateItem(idx, 'item', e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: '8px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid var(--border-subtle)',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Amount ($)"
                      value={item.amount || ''}
                      onChange={(e) => handleUpdateItem(idx, 'amount', Number(e.target.value))}
                      style={{
                        width: '110px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid var(--border-subtle)',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#f43f5e',
                        cursor: 'pointer',
                        padding: '0 6px',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Legal Ground (e.g. Normal wear & tear; non-refundable fee void under statute)"
                    value={item.reason}
                    onChange={(e) => handleUpdateItem(idx, 'reason', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid var(--border-subtle)',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem' }}
            disabled={isGenerating || disputedDeductions.length === 0}
            onClick={handleGenerateNotice}
          >
            <MailCheck size={18} />
            {isGenerating ? 'Synthesizing Certified Demand Notice...' : 'Generate Certified Demand Notice'}
          </button>
        </div>

        {/* Right Column: Letter Preview */}
        {generatedLetter && (
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }} />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>Attorney-Grade Notice Synthesized</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-secondary"
                  style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                  onClick={handleCopy}
                >
                  {copied ? <Check size={13} color="#34d399" /> : <Copy size={13} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  className="btn-secondary"
                  style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                  onClick={handleDownload}
                >
                  <Download size={13} /> Export .md
                </button>
                <button
                  className="btn-secondary"
                  style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                  onClick={handlePrint}
                >
                  <Printer size={13} /> Print PDF
                </button>
              </div>
            </div>

            {/* Letter Markdown Paper Canvas */}
            <div style={{
              background: 'rgba(5, 7, 14, 0.95)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '24px',
              fontFamily: 'Georgia, serif',
              fontSize: '0.92rem',
              lineHeight: 1.7,
              color: '#e2e8f0',
              overflowY: 'auto',
              maxHeight: '620px',
              whiteSpace: 'pre-wrap',
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
            }}>
              {generatedLetter}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
