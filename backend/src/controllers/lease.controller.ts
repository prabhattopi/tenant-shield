import { Request, Response } from 'express';
import { LeaseAuditService } from '../services/leaseAudit.service.js';
import { StripeBillingService } from '../services/billing/stripe.service.js';

export async function analyzeLeaseHandler(req: Request, res: Response) {
  try {
    const userId = req.body.userId || '00000000-0000-0000-0000-000000000001';

    // Verify user entitlement quota
    const quota = await StripeBillingService.getUserQuota(userId);
    if (!quota.canAudit) {
      return res.status(402).json({
        success: false,
        quotaExhausted: true,
        message: 'Your free lease audit credit has been used. Upgrade to Pro or purchase a single report to analyze additional leases.',
        data: { quota },
      });
    }

    let fileBuffer: Buffer | null = null;
    let fileName = 'Uploaded_Lease_Agreement.pdf';

    if (req.file) {
      fileBuffer = req.file.buffer;
      fileName = req.file.originalname;
    } else if (req.body && req.body.leaseText) {
      // Support for direct text submission
      fileBuffer = Buffer.from(req.body.leaseText, 'utf-8');
      fileName = req.body.fileName || 'Pasted_Lease_Contract.txt';
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No lease PDF file or text provided for analysis.',
      });
    }

    const jurisdiction = {
      country: req.body.country || 'US',
      stateRegion: req.body.stateRegion || 'CA',
    };

    const audit = await LeaseAuditService.processAndAuditLease({
      fileBuffer,
      fileName,
      userId,
      jurisdiction,
    });

    // Deduct audit quota upon successful generation
    await StripeBillingService.deductAuditCredit(userId);

    const updatedQuota = await StripeBillingService.getUserQuota(userId);

    res.status(200).json({
      success: true,
      message: 'Lease analysis completed successfully',
      data: {
        ...audit,
        quota: updatedQuota,
      },
    });
  } catch (err: any) {
    console.error('❌ Error during lease analysis:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to analyze lease document',
    });
  }
}

export async function getLeaseAuditHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const audit = await LeaseAuditService.getLeaseAuditById(id);

    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Lease audit not found',
      });
    }

    res.status(200).json({
      success: true,
      data: audit,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Error fetching lease audit',
    });
  }
}

export async function getSampleLeaseHandler(req: Request, res: Response) {
  try {
    const sample = LeaseAuditService.getPreloadedSampleAudit();
    res.status(200).json({
      success: true,
      data: sample,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Error fetching sample lease',
    });
  }
}

export async function downloadSampleLeaseHandler(req: Request, res: Response) {
  try {
    const { SAMPLE_PREDATORY_LEASE_TEXT } = await import('../services/leaseAudit.service.js');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="California_Predatory_Lease_2026.txt"');
    res.send(SAMPLE_PREDATORY_LEASE_TEXT);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to download sample file',
    });
  }
}

export async function listUserAuditsHandler(req: Request, res: Response) {
  try {
    const userId = (req.query.userId as string) || '00000000-0000-0000-0000-000000000001';
    const list = await LeaseAuditService.listAuditsByUser(userId);
    res.status(200).json({
      success: true,
      data: list,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Error listing lease audits',
    });
  }
}
