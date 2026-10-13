import { Request, Response } from 'express';
import { StripeBillingService } from '../services/billing/stripe.service.js';
import { env } from '../config/env.js';
import Stripe from 'stripe';

export async function getQuotaHandler(req: Request, res: Response) {
  try {
    const userId = (req.query.userId as string) || '00000000-0000-0000-0000-000000000001';
    const quota = await StripeBillingService.getUserQuota(userId);

    res.status(200).json({
      success: true,
      data: quota,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch user quota',
    });
  }
}

export async function createCheckoutSessionHandler(req: Request, res: Response) {
  try {
    const {
      planType = 'pro',
      userEmail = 'tenant@example.com',
      userId = '00000000-0000-0000-0000-000000000001',
      successUrl = `${env.FRONTEND_URL}/#payment-success`,
      cancelUrl = `${env.FRONTEND_URL}/#pricing`,
    } = req.body;

    const result = await StripeBillingService.createCheckoutSession({
      userId,
      userEmail,
      planType,
      successUrl,
      cancelUrl,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to create Stripe checkout session',
    });
  }
}

export async function simulateUpgradeHandler(req: Request, res: Response) {
  try {
    const {
      planType = 'pro',
      userId = '00000000-0000-0000-0000-000000000001',
    } = req.body;

    const transactionId = `txn_sim_${Date.now()}`;
    const quota = await StripeBillingService.applyUpgrade({
      userId,
      planType,
      transactionId,
    });

    res.status(200).json({
      success: true,
      message: `Account upgraded to ${planType.toUpperCase()} successfully!`,
      data: quota,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to simulate upgrade',
    });
  }
}

export async function stripeWebhookHandler(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

  let event: any;

  if (webhookSecret && sig && env.STRIPE_SECRET_KEY) {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2024-12-18.acacia' as any });
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error('❌ Stripe webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    // Fallback if testing without webhook signature signing
    event = req.body;
  }

  // Handle successful checkout
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId || '00000000-0000-0000-0000-000000000001';
    const planType = (session.metadata?.planType as 'audit' | 'pro') || 'pro';

    await StripeBillingService.applyUpgrade({
      userId,
      planType,
      transactionId: session.id,
    });
    console.log(`✅ [Stripe Webhook] Processed upgrade for User ${userId} -> ${planType}`);
  }

  res.json({ received: true });
}
