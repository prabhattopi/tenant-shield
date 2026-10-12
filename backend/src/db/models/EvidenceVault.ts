import mongoose, { Schema, Document } from 'mongoose';

export interface IConditionEvidence extends Document {
  leaseId?: string;
  userId: string; // Postgres UUID
  roomName: string; // "Living Room", "Kitchen", "Master Bedroom"
  photoUrl: string;
  photoHash: string; // SHA-256
  notes: string;
  preExistingDamageIdentified: boolean;
  damageDescription?: string;
  certifiedTimestamp: Date;
  metadata: {
    originalFileName?: string;
    fileSizeBytes?: number;
    mimeType?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ConditionEvidenceSchema = new Schema<IConditionEvidence>(
  {
    leaseId: { type: String, index: true },
    userId: { type: String, required: true, index: true },
    roomName: { type: String, required: true },
    photoUrl: { type: String, required: true },
    photoHash: { type: String, required: true },
    notes: { type: String, default: '' },
    preExistingDamageIdentified: { type: Boolean, default: false },
    damageDescription: { type: String, default: '' },
    certifiedTimestamp: { type: Date, default: Date.now },
    metadata: {
      originalFileName: { type: String },
      fileSizeBytes: { type: Number },
      mimeType: { type: String },
    },
  },
  { timestamps: true }
);

export const ConditionEvidence =
  mongoose.models.ConditionEvidence || mongoose.model<IConditionEvidence>('ConditionEvidence', ConditionEvidenceSchema);
