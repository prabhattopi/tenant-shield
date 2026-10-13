import { Request, Response } from 'express';
import { DemandNoticeService } from '../services/demandNotice.service.js';

export async function generateNoticeHandler(req: Request, res: Response) {
  try {
    const {
      jurisdictionState = 'California',
      tenantName = 'Alex Mercer',
      landlordName = 'Apex Property Management LLC',
      landlordAddress = '100 Grand Ave, Oakland, CA',
      rentalAddress = 'Unit 4B, 742 Evergreen Terrace, Berkeley, CA',
      leaseEndDate = new Date().toISOString(),
      totalDepositPaid = 2400,
      unlawfullyWithheldAmount = 850,
      disputedDeductions = [],
      userId = '00000000-0000-0000-0000-000000000001',
      leaseId,
    } = req.body;

    const notice = await DemandNoticeService.generateDemandNotice({
      jurisdictionState,
      tenantName,
      landlordName,
      landlordAddress,
      rentalAddress,
      leaseEndDate,
      totalDepositPaid: Number(totalDepositPaid),
      unlawfullyWithheldAmount: Number(unlawfullyWithheldAmount),
      disputedDeductions: Array.isArray(disputedDeductions) && disputedDeductions.length > 0 ? disputedDeductions : [
        { item: 'Unlawful Turnover Cleaning Fee', amount: 450, reason: 'Statutorily void under Cal. Civ. Code § 1950.5(m)' },
        { item: 'Ordinary Wear & Tear Repainting', amount: 400, reason: 'Non-deductible ordinary paint wear' },
      ],
      userId,
      leaseId,
    });

    res.status(200).json({
      success: true,
      message: 'Certified Security Deposit Clawback Demand Notice generated successfully.',
      data: notice,
    });
  } catch (err: any) {
    console.error('❌ Error generating demand notice:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to generate demand notice',
    });
  }
}

export async function listNoticesHandler(req: Request, res: Response) {
  try {
    const userId = (req.query.userId as string) || '00000000-0000-0000-0000-000000000001';
    const notices = await DemandNoticeService.listNoticesByUser(userId);

    res.status(200).json({
      success: true,
      data: notices,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to list demand notices',
    });
  }
}

export async function getSampleNoticeHandler(req: Request, res: Response) {
  try {
    const sample = DemandNoticeService.getPreloadedSampleNotice();
    res.status(200).json({
      success: true,
      data: sample,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch sample notice',
    });
  }
}

export async function getNoticeByIdHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const notice = await DemandNoticeService.getNoticeById(id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Demand notice not found',
      });
    }

    res.status(200).json({
      success: true,
      data: notice,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch notice',
    });
  }
}
