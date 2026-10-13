import Stripe from 'stripe';
import { env } from '../../config/env.js';
import { dbQuery } from '../../config/postgres.js';

export interface UserQuotaStatus {
  userId: string;
  freeReportsRemaining: number;
  planTier: 'free' | 'pro' | 'enterprise';
  hasActiveSubscription: boolean;
  canAudit: boolean;
}

export class StripeBillingService {
  private static stripe: Stripe | null = null;

  private static getStripeClient(): Stripe | null {
    if (this.stripe) return this.stripe;
    if (env.STRIPE_SECRET_KEY && env.STRIPE_SECRET_KEY.startsWith('sk_')) {
      this.stripe = new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-12-18.acacia' as any,
      });
    }
    return this.stripe;
  }

  /**
   * Ensure user record exists in Postgres / In-memory store
   */
  public static async ensureUserExists(userId: string = '00000000-0000-0000-0000-000000000001', email: string = 'tenant@example.com'): Promise<any> {
    try {
      const existing = await dbQuery('SELECT * FROM users WHERE id = $1', [userId]);
      if (existing.rows.length > 0) {
        return existing.rows[0];
      }

      // Insert default demo tenant
      const inserted = await dbQuery(
        `INSERT INTO users (id, email, password_hash, full_name, free_reports_remaining)
         VALUES ($1, $2, 'hashed_demo_pw', 'Tenant Defender Demo', 1)
         ON CONFLICT (id) DO UPDATE SET updated_at = NOW()
         RETURNING *`,
        [userId, email]
      );
      return inserted.rows[0];
    } catch (err: any) {
      console.warn('⚠️ [Stripe Service] Non-critical user check note:', err.message);
      return {
        id: userId,
        email,
        free_reports_remaining: 1,
        plan_tier: 'free',
      };
    }
  }

  /**
   * Retrieves the current user's entitlement and quota ledger
   */
  public static async getUserQuota(userId: string = '00000000-0000-0000-0000-000000000001'): Promise<UserQuotaStatus> {
    await this.ensureUserExists(userId);

    try {
      // 1. Check for active Pro subscription
      const subRes = await dbQuery(
        `SELECT * FROM subscriptions WHERE user_id = $1 AND status = 'active' ORDER BY created_at DESC LIMIT 1`,
        [userId]
      );

      const hasActiveSub = subRes.rows.length > 0;
      const planTier = hasActiveSub ? (subRes.rows[0].plan_tier as 'pro' | 'enterprise') : 'free';

      // 2. Check remaining free reports
      const userRes = await dbQuery('SELECT free_reports_remaining FROM users WHERE id = $1', [userId]);
      const freeReports = userRes.rows[0]?.free_reports_remaining ?? 1;

      const canAudit = hasActiveSub || freeReports > 0;

      return {
        userId,
        freeReportsRemaining: freeReports,
        planTier,
        hasActiveSubscription: hasActiveSub,
        canAudit,
      };
    } catch (err) {
      return {
        userId,
        freeReportsRemaining: 1,
        planTier: 'free',
        hasActiveSubscription: false,
        canAudit: true,
      };
    }
  }

  /**
   * Decrements 1 report credit after successful audit (unless unlimited Pro)
   */
  public static async deductAuditCredit(userId: string = '00000000-0000-0000-0000-000000000001'): Promise<void> {
    try {
      const quota = await this.getUserQuota(userId);
      if (quota.hasActiveSubscription) {
        // Pro users have unlimited lease audits!
        return;
      }

      await dbQuery(
        `UPDATE users SET free_reports_remaining = GREATEST(0, free_reports_remaining - 1), updated_at = NOW() WHERE id = $1`,
        [userId]
      );
    } catch (err: any) {
      console.warn('⚠️ [Stripe Service] Credit deduction note:', err.message);
    }
  }

  /**
   * Creates a live Stripe Checkout session or resilient developer checkout session
   */
  public static async createCheckoutSession(params: {
    userId: string;
    userEmail: string;
    planType: 'audit' | 'pro';
    successUrl: string;
    cancelUrl: string;
  }): Promise<{ checkoutUrl: string; sessionId: string; mode: 'live_stripe' | 'dev_simulation' }> {
    const stripe = this.getStripeClient();

    if (stripe) {
      try {
        const isSubscription = params.planType === 'pro';

        const lineItem = isSubscription
          ? {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'TenantShield Pro Defender (Monthly)',
                  description: 'Unlimited AI Lease Audits, Evidence Vault, and Certified Demand Notice Generator',
                },
                unit_amount: 499, // $4.99/mo
                recurring: {
                  interval: 'month' as const,
                },
              },
              quantity: 1,
            }
          : {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'TenantShield Single Lease Deep Audit',
                  description: 'One-off comprehensive 20-point California & state tenancy legal audit',
                },
                unit_amount: 900, // $9.00
              },
              quantity: 1,
            };

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [lineItem],
          mode: isSubscription ? 'subscription' : 'payment',
          success_url: `${params.successUrl}?session_id={CHECKOUT_SESSION_ID}&plan=${params.planType}`,
          cancel_url: params.cancelUrl,
          customer_email: params.userEmail,
          metadata: {
            userId: params.userId,
            planType: params.planType,
          },
        });

        return {
          checkoutUrl: session.url || params.successUrl,
          sessionId: session.id,
          mode: 'live_stripe',
        };
      } catch (err: any) {
        console.warn('⚠️ Stripe API Error:', err.message, 'Falling back to developer simulation');
      }
    }

    // Developer / Offline Simulation URL
    const mockSessionId = `cs_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      checkoutUrl: `${params.successUrl}?session_id=${mockSessionId}&plan=${params.planType}&simulated=true`,
      sessionId: mockSessionId,
      mode: 'dev_simulation',
    };
  }

  /**
   * Applies an upgrade or one-off credit purchase to the user
   */
  public static async applyUpgrade(params: {
    userId: string;
    planType: 'audit' | 'pro';
    transactionId: string;
  }): Promise<UserQuotaStatus> {
    const { userId, planType, transactionId } = params;
    await this.ensureUserExists(userId);

    if (planType === 'pro') {
      // Create/Update active subscription
      await dbQuery(
        `INSERT INTO subscriptions (id, user_id, stripe_subscription_id, plan_tier, status, current_period_start, current_period_end)
         VALUES (gen_random_uuid(), $1, $2, 'pro', 'active', NOW(), NOW() + INTERVAL '30 days')`,
        [userId, transactionId]
      );
    } else {
      // Add 1 audit credit to user
      await dbQuery(
        `UPDATE users SET free_reports_remaining = free_reports_remaining + 1, updated_at = NOW() WHERE id = $1`,
        [userId]
      );
    }

    // Record credit transaction
    await dbQuery(
      `INSERT INTO credit_transactions (id, user_id, amount_cents, transaction_type, stripe_payment_intent_id, status)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, 'succeeded')`,
      [userId, planType === 'pro' ? 499 : 900, planType === 'pro' ? 'subscription_create' : 'one_off_audit', transactionId]
    );

    return this.getUserQuota(userId);
  }
}
