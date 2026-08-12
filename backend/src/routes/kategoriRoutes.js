import express from 'express';

import {getAllKategori} from '../controllers/kategoriController.js';
import {getKategoriById} from '../controllers/kategoriController.js';
import {createKategori} from '../controllers/kategoriController.js';
import {updateKategori} from '../controllers/kategoriController.js';
import {deleteKategori} from '../controllers/kategoriController.js';
import {authMiddleware} from '../middleware/authMiddleware.js';
import {roleMiddleware} from '../middleware/roleMiddleware.js';

const router = express.Router();

// Semua route kategori memerlukan autentikasi supervisor
router.use(authMiddleware);
router.use(roleMiddleware('supervisor'));

router.get('/', getAllKategori);
router.get('/:id', getKategoriById);

router.post('/', createKategori);

router.put('/:id', updateKategori);

router.delete('/:id', deleteKategori);

export default router;