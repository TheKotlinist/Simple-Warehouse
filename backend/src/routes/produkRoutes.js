import express from 'express';
import { getAllProduk } from '../controllers/produkController.js';
import { getProdukById } from '../controllers/produkController.js';
import { createProduk } from '../controllers/produkController.js';
import { updateProduk } from '../controllers/produkController.js';
import { deleteProduk } from '../controllers/produkController.js';

const router = express.Router();

router.get('/', getAllProduk);
router.get('/:id', getProdukById);

router.post('/', createProduk);

router.put('/:id', updateProduk);

router.delete('/:id', deleteProduk);

export default router;