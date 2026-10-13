import { Router } from 'express';
import healthRoutes from './health.routes.js';
import leaseRoutes from './lease.routes.js';
import billingRoutes from './billing.routes.js';
import vaultRoutes from './vault.routes.js';
import demandRoutes from './demand.routes.js';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/leases', leaseRoutes);
apiRouter.use('/billing', billingRoutes);
apiRouter.use('/vault', vaultRoutes);
apiRouter.use('/demand', demandRoutes);

export default apiRouter;
