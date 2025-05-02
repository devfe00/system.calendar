import express from 'express';
import { getAllClients, getClientById, updateClient, deleteClient } from '../controllers/client.controller.js';

const router = express.Router();

router.get('/', getAllClients);
router.get('/:id', getClientById);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

export default router;