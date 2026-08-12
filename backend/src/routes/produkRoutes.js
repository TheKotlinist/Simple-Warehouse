import express from 'express';
import { getAllProduk } from '../controllers/produkController.js';
import { getProdukById } from '../controllers/produkController.js';
import { createProduk } from '../controllers/produkController.js';
import { updateProduk } from '../controllers/produkController.js';
import { deleteProduk } from '../controllers/produkController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Semua route produk memerlukan autentikasi
router.use(authMiddleware);

router.get('/', roleMiddleware(['staff_gudang', 'supervisor']), getAllProduk);
router.get('/:id', roleMiddleware(['staff_gudang', 'supervisor']), getProdukById);

router.post('/', roleMiddleware('supervisor'), createProduk);
router.put('/:id', roleMiddleware('supervisor'), updateProduk);
router.delete('/:id', roleMiddleware('supervisor'), deleteProduk);

export default router;