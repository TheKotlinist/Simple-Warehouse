import express from 'express';

import {createBarangMasuk} from '../controllers/transaksiController.js';
import {createBarangKeluar} from '../controllers/transaksiController.js';
import {getRiwayatTransaksi} from '../controllers/transaksiController.js';
import {authMiddleware} from '../middleware/authMiddleware.js';
import {roleMiddleware} from '../middleware/roleMiddleware.js';

const router = express.Router();

// Semua route transaksi memerlukan autentikasi staff_gudang atau supervisor
router.use(authMiddleware);
router.use(roleMiddleware(['staff_gudang', 'supervisor']));

router.get('/', getRiwayatTransaksi);
router.post('/masuk', createBarangMasuk);
router.post('/keluar', createBarangKeluar);

export default router;