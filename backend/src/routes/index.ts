import { Router } from 'express';
import healthRoutes from './health.routes.js';
import leaseRoutes from './lease.routes.js';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/leases', leaseRoutes);

export default apiRouter;
