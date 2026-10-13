import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, ArrowRight, Zap, ShieldAlert, Sparkles, MapPin } from 'lucide-react';
import { LeaseAuditSummary } from '../types';

interface LeaseUploaderProps {
  onAuditCompleted: (audit: LeaseAuditSummary) => void;
}

export const LeaseUploader: React.FC<LeaseUploaderProps> = ({ onAuditCompleted }) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stateRegion, setStateRegion] = useState<string>('CA');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processingSteps = [
    'Parsing heavy document pages & coordinate streams...',
    'Boundary detection: Section headers & clause hierarchy...',
    'Cross-referencing statutory tenant protection matrix...',
    'Synthesizing risk scores & financial exposure liabilities...',
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

  const executeUploadAndAudit = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setCurrentStep(0);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev < processingSteps.length - 1 ? prev + 1 : prev));
    }, 1100);

    try {
      const formData = new FormData();
      formData.append('leaseFile', selectedFile);
      formData.append('country', 'US');
      formData.append('stateRegion', stateRegion);

      const res = await fetch('/api/leases/analyze', {
        method: 'POST',
        body: formData,
      });

      clearInterval(stepInterval);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Analysis failed with status ${res.status}`);
      }

      const json = await res.json();
      if (json.success && json.data) {
        onAuditCompleted(json.data);
      } else {
        throw new Error('Server returned unsuccessful audit payload');
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMessage(err.message || 'Failed to complete lease analysis.');
    } finally {
      setIsProcessing(false);
    }
  };

  const loadDemoSampleLease = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setCurrentStep(1);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev < processingSteps.length - 1 ? prev + 1 : prev));
    }, 700);

    try {
      const res = await fetch('/api/leases/sample');
      clearInterval(stepInterval);
      if (!res.ok) throw new Error('Failed to load sample lease');
      const json = await res.json();
      if (json.success && json.data) {
        onAuditCompleted(json.data);
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMessage(err.message || 'Failed to load sample lease');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '36px', maxWidth: '880px', margin: '32px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
          Upload & Audit Residential Lease
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', maxWidth: '620px', margin: '0 auto' }}>
          Drop your 10 to 60+ page PDF rental agreement. Our boundary-aware streaming engine detects 
          illegal deposit forfeiture clauses, unannounced entry waivers, and hidden habitability disclaimers.
        </p>
      </div>

      {/* Jurisdiction Config */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          padding: '8px 16px',
          borderRadius: '10px',
          fontSize: '0.85rem',
        }}>
          <MapPin size={15} color="#818cf8" />
          <span style={{ color: 'var(--text-dim)' }}>Legal Jurisdiction:</span>
          <select
            value={stateRegion}
            onChange={(e) => setStateRegion(e.target.value)}
            disabled={isProcessing}
            style={{
              background: '#0f172a',
              color: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.82rem',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="CA">California (Civil Code § 1950.5)</option>
            <option value="NY">New York (HSTPA § 7-108)</option>
            <option value="TX">Texas (Property Code § 92)</option>
            <option value="FL">Florida (Statutes § 83)</option>
            <option value="UK">United Kingdom (Tenant Fees Act)</option>
            <option value="IN">India (Model Tenancy Act)</option>
          </select>
        </div>

        {/* 1-Click Instant Demo Button */}
        <button
          onClick={loadDemoSampleLease}
          disabled={isProcessing}
          className="btn-secondary"
          style={{
            padding: '8px 16px',
            fontSize: '0.84rem',
            background: 'rgba(99, 102, 241, 0.1)',
            borderColor: 'rgba(99, 102, 241, 0.35)',
            color: '#c7d2fe',
          }}
        >
          <Zap size={14} color="#818cf8" />
          ⚡ 1-Click Demo (38-Page Predatory Lease)
        </button>
      </div>

      {/* Drag & Drop Zone */}
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
              padding: '42px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragActive ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.015)',
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
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>{selectedFile.name}</span>
                </div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for statutory audit
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '6px' }}>
                  Click to choose file or drag & drop lease PDF
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
                Execute Deep Legal Audit
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Processing Loading State */
        <div style={{ padding: '36px 16px', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: '3px solid rgba(99, 102, 241, 0.2)',
            borderTopColor: '#818cf8',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px auto',
          }}>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
            Auditing Legal Boundaries
          </h3>
          <p style={{ color: '#818cf8', fontSize: '0.92rem', fontWeight: 600, minHeight: '24px' }}>
            {processingSteps[currentStep]}
          </p>

          <div style={{
            maxWidth: '460px',
            margin: '24px auto 0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            textAlign: 'left',
          }}>
            {processingSteps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.82rem',
                  color: idx <= currentStep ? '#f1f5f9' : 'var(--text-dim)',
                  opacity: idx <= currentStep ? 1 : 0.4,
                  transition: 'var(--transition-smooth)',
                }}
              >
                <CheckCircle2 size={14} color={idx <= currentStep ? '#34d399' : '#64748b'} />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {errorMessage && (
        <div style={{
          marginTop: '20px',
          padding: '12px 16px',
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: '10px',
          color: '#fda4af',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.86rem',
        }}>
          <ShieldAlert size={16} />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
