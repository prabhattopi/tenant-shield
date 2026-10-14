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
  MailCheck,
  FileText,
  Code
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
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');

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

  // Helper to parse bolding, badges, dollar amounts, and statutory citations
  const parseInlineFormatting = (text: string) => {
    // Regex splits by markdown bolding **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const inner = part.slice(2, -2).trim();
        // Highlight monetary values
        if (inner.includes('$')) {
          return (
            <span
              key={idx}
              style={{
                background: 'rgba(52, 211, 153, 0.15)',
                color: '#34d399',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: '4px',
                border: '1px solid rgba(52, 211, 153, 0.3)',
              }}
            >
              {inner}
            </span>
          );
        }
        // Highlight statutory codes
        if (inner.includes('§') || inner.includes('Civil Code') || inner.includes('Statutory') || inner.includes('HSTPA')) {
          return (
            <span
              key={idx}
              style={{
                background: 'rgba(129, 140, 248, 0.15)',
                color: '#818cf8',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: '4px',
                border: '1px solid rgba(129, 140, 248, 0.3)',
              }}
            >
              {inner}
            </span>
          );
        }
        return <strong key={idx} style={{ color: '#ffffff', fontWeight: 700 }}>{inner}</strong>;
      }

      // Format backticks `code`
      const backtickParts = part.split(/(`.*?`)/g);
      return backtickParts.map((sub, sIdx) => {
        if (sub.startsWith('`') && sub.endsWith('`')) {
          return (
            <code
              key={`${idx}-${sIdx}`}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#f8fafc',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.88em',
              }}
            >
              {sub.slice(1, -1)}
            </code>
          );
        }
        return sub;
      });
    });
  };

  // Rich legal notice document renderer (No raw markdown clutter)
  const renderFormattedNotice = (markdown: string) => {
    // 1. Strip out any AI meta-commentary notes like **[IMPORTANT NOTE...]**
    let sanitized = markdown
      .replace(/\*\*\[IMPORTANT NOTE[\s\S]*?\*\*(\n\n|---|\n)/gi, '')
      .replace(/\[IMPORTANT NOTE[\s\S]*?\](\n\n|---|\n)/gi, '')
      .trim();

    // 2. Split into semantic paragraph/block chunks
    const blocks = sanitized.split(/\n\n+/);

    return (
      <div style={{ color: '#e2e8f0', lineHeight: 1.8, fontSize: '0.94rem' }}>
        {blocks.map((block, bIdx) => {
          const trimmed = block.trim();
          if (!trimmed) return null;

          // Horizontal rule
          if (trimmed === '---' || trimmed === '***') {
            return (
              <hr
                key={bIdx}
                style={{
                  border: 'none',
                  borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                  margin: '22px 0',
                }}
              />
            );
          }

          // Main Header #
          if (trimmed.startsWith('# ')) {
            const heading = trimmed.replace(/^#\s*/, '').replace(/\*\*/g, '');
            return (
              <h2
                key={bIdx}
                style={{
                  fontSize: '1.28rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: '14px',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.01em',
                  borderBottom: '2px solid rgba(99, 102, 241, 0.4)',
                  paddingBottom: '10px',
                }}
              >
                {heading}
              </h2>
            );
          }

          // Subheader ## or ###
          if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
            const heading = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, '');
            return (
              <h3
                key={bIdx}
                style={{
                  fontSize: '1.08rem',
                  fontWeight: 700,
                  color: '#a5b4fc',
                  marginTop: '22px',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ width: '4px', height: '16px', background: '#6366f1', borderRadius: '2px' }} />
                {heading}
              </h3>
            );
          }

          // Numbered list items (e.g. 1. Disputed Deduction...)
          if (trimmed.match(/^\d+\.\s+/)) {
            const items = trimmed.split(/\n(?=\d+\.\s+)/);
            return (
              <div key={bIdx} style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '14px 0' }}>
                {items.map((itemStr, iIdx) => {
                  const cleaned = itemStr.replace(/^\d+\.\s+/, '');
                  return (
                    <div
                      key={iIdx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.025)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '14px 16px',
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'rgba(99, 102, 241, 0.2)',
                          color: '#818cf8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          flexShrink: 0,
                          marginTop: '2px',
                        }}
                      >
                        {iIdx + 1}
                      </div>
                      <div style={{ flex: 1, lineHeight: 1.65 }}>
                        {parseInlineFormatting(cleaned)}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }

          // Bullet points
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const bulletItems = trimmed.split(/\n[-*]\s+/).filter(Boolean);
            return (
              <ul
                key={bIdx}
                style={{
                  listStyle: 'none',
                  paddingLeft: 0,
                  margin: '12px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {bulletItems.map((bItem, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                    }}
                  >
                    <span style={{ color: '#34d399', fontWeight: 800, marginTop: '2px' }}>•</span>
                    <div>{parseInlineFormatting(bItem.replace(/^[-*]\s+/, ''))}</div>
                  </li>
                ))}
              </ul>
            );
          }

          // Regular paragraph
          return (
            <p key={bIdx} style={{ marginBottom: '14px' }}>
              {parseInlineFormatting(trimmed)}
            </p>
          );
        })}
      </div>
    );
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }} />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>Attorney-Grade Notice Synthesized</span>
              </div>

              {/* View Switcher: Styled Legal Document vs Raw Markdown */}
              <div style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '3px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                gap: '2px',
              }}>
                <button
                  type="button"
                  onClick={() => setViewMode('formatted')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background: viewMode === 'formatted' ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                    color: viewMode === 'formatted' ? '#ffffff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <FileText size={13} color={viewMode === 'formatted' ? '#818cf8' : 'currentColor'} />
                  Styled View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('raw')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background: viewMode === 'raw' ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                    color: viewMode === 'raw' ? '#ffffff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <Code size={13} color={viewMode === 'raw' ? '#818cf8' : 'currentColor'} />
                  Raw Markdown
                </button>
              </div>

              {/* Action Buttons */}
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

            {/* Document Canvas */}
            <div style={{
              background: 'rgba(5, 7, 14, 0.95)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '28px 32px',
              fontFamily: viewMode === 'formatted' ? 'var(--font-sans), sans-serif' : 'monospace',
              fontSize: '0.92rem',
              lineHeight: 1.7,
              color: '#e2e8f0',
              overflowY: 'auto',
              maxHeight: '620px',
              whiteSpace: viewMode === 'raw' ? 'pre-wrap' : 'normal',
              boxShadow: 'inset 0 2px 14px rgba(0, 0, 0, 0.6)',
            }}>
              {viewMode === 'formatted' ? (
                renderFormattedNotice(generatedLetter)
              ) : (
                generatedLetter
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
