import mongoose, { Schema, Document } from 'mongoose';

export interface IDemandLetter extends Document {
  userId: string; // Postgres UUID
  leaseId?: string;
  landlordName: string;
  landlordAddress: string;
  tenantName: string;
  rentalAddress: string;
  leaseEndDate: Date;
  totalDepositPaid: number;
  unlawfullyWithheldAmount: number;
  statutoryCitations: string[];
  disputedItems: Array<{
    itemDescription: string;
    amountCharged: number;
    legalReason: string;
  }>;
  statutoryDeadlineDays: number;
  letterMarkdown: string;
  status: 'DRAFT' | 'READY_TO_SERVE' | 'SERVED';
  createdAt: Date;
  updatedAt: Date;
}

const DemandLetterSchema = new Schema<IDemandLetter>(
  {
    userId: { type: String, required: true, index: true },
    leaseId: { type: String, index: true },
    landlordName: { type: String, required: true },
    landlordAddress: { type: String, required: true },
    tenantName: { type: String, required: true },
    rentalAddress: { type: String, required: true },
    leaseEndDate: { type: Date, required: true },
    totalDepositPaid: { type: Number, required: true },
    unlawfullyWithheldAmount: { type: Number, required: true },
    statutoryCitations: [{ type: String }],
    disputedItems: [
      {
        itemDescription: { type: String, required: true },
        amountCharged: { type: Number, required: true },
        legalReason: { type: String, required: true },
      },
    ],
    statutoryDeadlineDays: { type: Number, default: 21 },
    letterMarkdown: { type: String, required: true },
    status: {
      type: String,
      enum: ['DRAFT', 'READY_TO_SERVE', 'SERVED'],
      default: 'DRAFT',
    },
  },
  { timestamps: true }
);

export const DemandLetter =
  mongoose.models.DemandLetter || mongoose.model<IDemandLetter>('DemandLetter', DemandLetterSchema);
