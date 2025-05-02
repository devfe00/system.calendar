import express from 'express';
import { createProvider, getAllProviders, getProviderById } from '../controllers/provider.controller.js';

const router = express.Router();

router.post('/', createProvider);
router.get('/', getAllProviders);
router.get('/:id', getProviderById);

export default router;