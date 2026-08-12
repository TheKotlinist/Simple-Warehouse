import express from 'express';

import {getAllRak} from '../controllers/rakController.js';
import {getRakById} from '../controllers/rakController.js';
import {createRak} from '../controllers/rakController.js';
import {updateRak} from '../controllers/rakController.js';
import {deleteRak} from '../controllers/rakController.js';
import {authMiddleware} from '../middleware/authMiddleware.js';
import {roleMiddleware} from '../middleware/roleMiddleware.js';

const router = express.Router();

// Semua route rak memerlukan autentikasi supervisor
router.use(authMiddleware);
router.use(roleMiddleware('supervisor'));

router.get('/', getAllRak);
router.get('/:id', getRakById);

router.post('/', createRak);

router.put('/:id', updateRak);

router.delete('/:id', deleteRak);

export default router;