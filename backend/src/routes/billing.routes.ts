import { Router } from 'express';
import {
  getQuotaHandler,
  createCheckoutSessionHandler,
  simulateUpgradeHandler,
  stripeWebhookHandler,
} from '../controllers/billing.controller.js';

const router = Router();

router.get('/quota', getQuotaHandler);
router.post('/create-checkout-session', createCheckoutSessionHandler);
router.post('/simulate-upgrade', simulateUpgradeHandler);
router.post('/webhook', stripeWebhookHandler);

export default router;
