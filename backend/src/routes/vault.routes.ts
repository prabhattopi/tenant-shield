import { Router } from 'express';
import multer from 'multer';
import {
  uploadEvidenceHandler,
  listEvidenceHandler,
  getSampleEvidenceHandler,
  deleteEvidenceHandler,
} from '../controllers/vault.controller.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB per photo
  },
});

router.post('/upload', upload.single('photo'), uploadEvidenceHandler);
router.get('/', listEvidenceHandler);
router.get('/sample', getSampleEvidenceHandler);
router.delete('/:id', deleteEvidenceHandler);

export default router;
