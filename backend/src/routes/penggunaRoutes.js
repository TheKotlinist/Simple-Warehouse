import express from 'express';

import {
  getAllPengguna,
  getPenggunaById,
  createPengguna,
  updatePengguna,
  deletePengguna
} from '../controllers/penggunaController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Semua rute pengguna memerlukan autentikasi supervisor
router.use(authMiddleware);
router.use(roleMiddleware('supervisor'));

router.get('/', getAllPengguna);
router.get('/:id', getPenggunaById);
router.post('/', createPengguna);
router.put('/:id', updatePengguna);
router.delete('/:id', deletePengguna);

export default router;
