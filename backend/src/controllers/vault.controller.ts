import { Request, Response } from 'express';
import { EvidenceVaultService } from '../services/vault.service.js';

export async function uploadEvidenceHandler(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No room condition image file provided.',
      });
    }

    const {
      roomName = 'Room Evidence',
      notes = '',
      preExistingDamageIdentified = 'false',
      damageDescription = '',
      userId = '00000000-0000-0000-0000-000000000001',
    } = req.body;

    const evidence = await EvidenceVaultService.addEvidence({
      userId,
      roomName,
      notes,
      preExistingDamageIdentified: preExistingDamageIdentified === 'true' || preExistingDamageIdentified === true,
      damageDescription,
      fileBuffer: req.file.buffer,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
    });

    res.status(201).json({
      success: true,
      message: 'Condition evidence cryptographically secured with SHA-256 fingerprint.',
      data: evidence,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to upload condition evidence',
    });
  }
}

export async function listEvidenceHandler(req: Request, res: Response) {
  try {
    const userId = (req.query.userId as string) || '00000000-0000-0000-0000-000000000001';
    const items = await EvidenceVaultService.listEvidenceByUser(userId);

    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to retrieve evidence items',
    });
  }
}

export async function getSampleEvidenceHandler(req: Request, res: Response) {
  try {
    const samples = EvidenceVaultService.getPreloadedSampleVault();
    res.status(200).json({
      success: true,
      data: samples,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to get sample evidence',
    });
  }
}

export async function deleteEvidenceHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await EvidenceVaultService.deleteEvidence(id);
    res.status(200).json({
      success: true,
      message: 'Evidence deleted successfully',
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to delete evidence',
    });
  }
}
