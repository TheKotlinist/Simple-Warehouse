import express from 'express';
import { getLaporanStokMinimum } from '../controllers/laporanController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Semua route laporan memerlukan autentikasi supervisor
router.use(authMiddleware);
router.use(roleMiddleware('supervisor'));

router.get('/stok-minimum', getLaporanStokMinimum);

export default router;

