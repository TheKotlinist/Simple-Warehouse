import express from 'express';

import {getAllSupplier} from '../controllers/supplierController.js';
import {getSupplierById} from '../controllers/supplierController.js';
import {createSupplier} from '../controllers/supplierController.js';
import {updateSupplier} from '../controllers/supplierController.js';
import {deleteSupplier} from '../controllers/supplierController.js';
import {authMiddleware} from '../middleware/authMiddleware.js';
import {roleMiddleware} from '../middleware/roleMiddleware.js';

const router = express.Router();

// Semua route supplier memerlukan autentikasi
router.use(authMiddleware);

router.get('/', roleMiddleware(['staff_gudang', 'supervisor']), getAllSupplier);
router.get('/:id', roleMiddleware(['staff_gudang', 'supervisor']), getSupplierById);

router.post('/', roleMiddleware('supervisor'), createSupplier);

router.put('/:id', roleMiddleware('supervisor'), updateSupplier);

router.delete('/:id', roleMiddleware('supervisor'), deleteSupplier);

export default router;