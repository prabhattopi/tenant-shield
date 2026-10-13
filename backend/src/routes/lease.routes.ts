import { Router } from 'express';
import multer from 'multer';
import {
  analyzeLeaseHandler,
  getLeaseAuditHandler,
  getSampleLeaseHandler,
  downloadSampleLeaseHandler,
  listUserAuditsHandler,
} from '../controllers/lease.controller.js';

const router = Router();

// Configure Multer for memory buffer streaming (up to 50MB for heavy contracts)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

router.post('/analyze', upload.single('leaseFile'), analyzeLeaseHandler);
router.get('/sample', getSampleLeaseHandler);
router.get('/download-sample', downloadSampleLeaseHandler);
router.get('/:id', getLeaseAuditHandler);
router.get('/', listUserAuditsHandler);

export default router;
