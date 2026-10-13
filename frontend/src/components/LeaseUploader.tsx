import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  ShieldAlert, 
  Sparkles, 
  MapPin, 
  Download, 
  Coffee,
  FileCheck
} from 'lucide-react';
import { LeaseAuditSummary } from '../types';

interface LeaseUploaderProps {
  onAuditCompleted: (audit: LeaseAuditSummary) => void;
  onUpgradeRequested?: () => void;
}

export const LeaseUploader: React.FC<LeaseUploaderProps> = ({ onAuditCompleted, onUpgradeRequested }) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stateRegion, setStateRegion] = useState<string>('CA');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const engagingProgressMessages = [
    { threshold: 10, msg: "Uploading heavy contract chunks... Take a sip of coffee ☕" },
    { threshold: 30, msg: "Streaming page coordinate buffers... Zero memory leak footprint 🚀" },
    { threshold: 52, msg: "Hunting sneaky indemnity traps & habitability waivers in fine print 🕵️‍♂️" },
    { threshold: 76, msg: "Cross-referencing statutory tenant protection codes & state precedents ⚖️" },
    { threshold: 92, msg: "Quantifying financial exposure & generating safe counter-clauses 💰" },
    { threshold: 100, msg: "Legal defense audit synthesized! Leveling the playing field 🛡️" },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setErrorMessage(null);
    if (!file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.txt')) {
      setErrorMessage('Please upload a PDF (.pdf) or text (.txt) residential lease agreement.');
      return;
    }
    setSelectedFile(file);
  };

  const [isQuotaExhausted, setIsQuotaExhausted] = useState<boolean>(false);

  // Simulates or handles real upload with smooth progress counter
  const executeUploadAndAudit = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setIsQuotaExhausted(false);
    setProgressPercent(10);

    // Dynamic progress ticker
    const progressTimer = setInterval(() => {
      setProgressPercent(prev => {
        if (prev >= 94) return 94; // Hold at 94% until API returns
        const next = prev + Math.floor(Math.random() * 8) + 4;
        return next > 94 ? 94 : next;
      });
    }, 280);

    try {
      const formData = new FormData();
      formData.append('leaseFile', selectedFile);
      formData.append('country', 'US');
      formData.append('stateRegion', stateRegion);

      const res = await fetch('/api/leases/analyze', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressTimer);
      setProgressPercent(100);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        if (res.status === 402 || errJson.quotaExhausted) {
          setIsQuotaExhausted(true);
          throw new Error('Your free lease audit credit has been used. Upgrade to Pro or purchase a single audit credit to continue.');
        }
        throw new Error(errJson.message || `Analysis failed with status ${res.status}`);
      }

      const json = await res.json();
      if (json.success && json.data) {
        setTimeout(() => {
          onAuditCompleted(json.data);
        }, 600);
      } else {
        throw new Error('Server returned unsuccessful audit payload');
      }
    } catch (err: any) {
      clearInterval(progressTimer);
      setErrorMessage(err.message || 'Failed to complete lease analysis.');
      setIsProcessing(false);
    }
  };

  // 1-Click Instant Demo
  const loadDemoSampleLease = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setProgressPercent(15);

    const progressTimer = setInterval(() => {
      setProgressPercent(prev => {
        if (prev >= 95) return 95;
        const next = prev + 14;
        return next > 95 ? 95 : next;
      });
    }, 200);

    try {
      const res = await fetch('/api/leases/sample');
      clearInterval(progressTimer);
      setProgressPercent(100);

      if (!res.ok) throw new Error('Failed to load sample lease');
      const json = await res.json();
      if (json.success && json.data) {
        setTimeout(() => {
          onAuditCompleted(json.data);
        }, 500);
      }
    } catch (err: any) {
      clearInterval(progressTimer);
      setErrorMessage(err.message || 'Failed to load sample lease');
      setIsProcessing(false);
    }
  };

  // Pre-loads a real File object into dropzone for drag/drop demo
  const autoFillSampleIntoDropzone = async () => {
    try {
      const res = await fetch('/api/leases/download-sample');
      const text = await res.text();
      const sampleFile = new File([text], 'California_Predatory_Lease_2026.txt', { type: 'text/plain' });
      setSelectedFile(sampleFile);
      setErrorMessage(null);
    } catch (err) {
      // Fallback local file creation
      const localSample = new File(['SAMPLE LEASE AGREEMENT...'], 'Sample_Lease_Contract_2026.txt', { type: 'text/plain' });
      setSelectedFile(localSample);
    }
  };

  // Current active progress message
  const activeMessage = 
    engagingProgressMessages.slice().reverse().find(m => progressPercent >= m.threshold)?.msg || 
    engagingProgressMessages[0].msg;

  return (
    <div className="glass-panel" style={{ padding: '36px', maxWidth: '920px', margin: '32px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '8px' }}>
          Upload & Audit Residential Lease
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', maxWidth: '640px', margin: '0 auto' }}>
          Drop your 10 to 60+ page PDF rental contract. Our clause-boundary parser detects 
          unlawful deposit traps, unannounced entry waivers, and creates attorney-grade counter-clauses.
        </p>
      </div>

      {/* Top Testing Action Bar: Sample Downloads & Auto-Fill */}
      <div style={{
        background: 'rgba(99, 102, 241, 0.08)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        borderRadius: '14px',
        padding: '12px 18px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c7d2fe', fontSize: '0.84rem', fontWeight: 600 }}>
          <Sparkles size={16} color="#818cf8" />
          <span>Need a test lease? We've prepared a real 38-page predatory contract:</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <a
            href="/api/leases/download-sample"
            download="California_Predatory_Lease_2026.txt"
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.78rem', gap: '6px', textDecoration: 'none' }}
          >
            <Download size={13} />
            Download Sample File
          </a>

          <button
            onClick={autoFillSampleIntoDropzone}
            disabled={isProcessing}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.78rem', gap: '6px', background: 'rgba(255, 255, 255, 0.08)' }}
          >
            <FileCheck size={13} color="#34d399" />
            Auto-Drop into Box
          </button>

          <button
            onClick={loadDemoSampleLease}
            disabled={isProcessing}
            className="btn-primary"
            style={{ padding: '6px 14px', fontSize: '0.78rem', gap: '6px' }}
          >
            <Zap size={13} />
            1-Click Instant Demo
          </button>
        </div>
      </div>

      {/* Jurisdiction Picker */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '22px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          padding: '6px 14px',
          borderRadius: '10px',
          fontSize: '0.82rem',
        }}>
          <MapPin size={14} color="#818cf8" />
          <span style={{ color: 'var(--text-dim)' }}>Legal Statutory Model:</span>
          <select
            value={stateRegion}
            onChange={(e) => setStateRegion(e.target.value)}
            disabled={isProcessing}
            style={{
              background: '#0a0f1d',
              color: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '3px 8px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="CA">California (Civil Code § 1950.5)</option>
            <option value="NY">New York (HSTPA § 7-108)</option>
            <option value="TX">Texas (Property Code § 92)</option>
            <option value="FL">Florida (Statutes § 83)</option>
            <option value="UK">United Kingdom (Tenant Fees Act 2019)</option>
            <option value="IN">India (Model Tenancy Act)</option>
          </select>
        </div>
      </div>

      {/* Drag & Drop Zone or Dynamic Progress */}
      {!isProcessing ? (
        <div>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: dragActive ? '2px dashed #818cf8' : '2px dashed var(--border-subtle)',
              borderRadius: '16px',
              padding: '40px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragActive ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.015)',
              transition: 'var(--transition-smooth)',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: '#818cf8',
            }}>
              <UploadCloud size={28} />
            </div>

            {selectedFile ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
                  <FileText size={18} color="#34d399" />
                  <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ffffff' }}>{selectedFile.name}</span>
                </div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>
                  {(selectedFile.size / 1024).toFixed(1)} KB • File Loaded & Ready
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '6px' }}>
                  Drag & Drop Lease Agreement PDF Here, or Click to Browse
                </div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>
                  Supports heavy PDF contracts up to 50MB (Page coordinate stream extraction)
                </div>
              </div>
            )}
          </div>

          {selectedFile && (
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <button
                onClick={executeUploadAndAudit}
                className="btn-primary"
                style={{ fontSize: '1rem', padding: '14px 32px' }}
              >
                <Sparkles size={18} />
                Execute Deep Legal Audit on This Lease
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Dynamic Progress Bar & Coffee Messages */
        <div style={{
          padding: '40px 24px',
          background: 'rgba(0, 0, 0, 0.35)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          textAlign: 'center',
        }}>
          {/* Progress Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Coffee size={20} color="#f59e0b" className="pulse-glow" />
              <span style={{ fontWeight: 700, fontSize: '0.98rem', color: '#ffffff' }}>
                Analyzing Legal Contract Integrity
              </span>
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: '1.15rem',
              color: '#38bdf8',
            }}>
              {progressPercent}%
            </div>
          </div>

          {/* Animated Progress Bar Track */}
          <div style={{
            width: '100%',
            height: '10px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
            marginBottom: '18px',
            position: 'relative',
          }}>
            <div style={{
              height: '100%',
              width: `${progressPercent}%`,
              borderRadius: '9999px',
              background: 'linear-gradient(90deg, #6366f1 0%, #38bdf8 50%, #34d399 100%)',
              boxShadow: '0 0 16px rgba(99, 102, 241, 0.6)',
              transition: 'width 0.25s ease-out',
            }} />
          </div>

          {/* Active Witty / Educational Message */}
          <div style={{
            padding: '12px 18px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: '10px',
            fontSize: '0.9rem',
            color: '#c7d2fe',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            minHeight: '44px',
          }}>
            {activeMessage}
          </div>

          {/* Micro Telemetry Steps */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px',
            marginTop: '24px',
            textAlign: 'left',
          }}>
            {engagingProgressMessages.slice(0, 4).map((m, idx) => {
              const done = progressPercent >= m.threshold;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.76rem',
                    color: done ? '#34d399' : 'var(--text-dim)',
                    opacity: done ? 1 : 0.45,
                  }}
                >
                  <CheckCircle2 size={13} color={done ? '#34d399' : '#64748b'} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {m.msg.split('...')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Error Message Box */}
      {errorMessage && (
        <div style={{
          marginTop: '20px',
          padding: '14px 18px',
          background: isQuotaExhausted ? 'rgba(99, 102, 241, 0.12)' : 'rgba(244, 63, 94, 0.1)',
          border: isQuotaExhausted ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: '12px',
          color: isQuotaExhausted ? '#c7d2fe' : '#fda4af',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.88rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isQuotaExhausted ? <Sparkles size={18} color="#818cf8" /> : <ShieldAlert size={18} color="#f43f5e" />}
            <span>{errorMessage}</span>
          </div>

          {isQuotaExhausted && onUpgradeRequested && (
            <button
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.82rem', borderRadius: '8px' }}
              onClick={onUpgradeRequested}
            >
              <Zap size={14} />
              Upgrade Pro ($4.99) or Single ($9)
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
