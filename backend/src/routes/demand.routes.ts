import { Router } from 'express';
import {
  generateNoticeHandler,
  listNoticesHandler,
  getSampleNoticeHandler,
  getNoticeByIdHandler,
} from '../controllers/demand.controller.js';

const router = Router();

router.post('/generate', generateNoticeHandler);
router.get('/', listNoticesHandler);
router.get('/sample', getSampleNoticeHandler);
router.get('/:id', getNoticeByIdHandler);

export default router;
