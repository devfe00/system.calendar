import express from 'express';
import { 
    createSchedule, 
    getSchedulesByProvider, 
    getSchedulesByClient, 
    updateScheduleStatus 
} from '../controllers/schedule.controller.js';

const router = express.Router();

router.post('/', createSchedule);
router.get('/provider/:provider_id', getSchedulesByProvider);
router.get('/client/:client_id', getSchedulesByClient);
router.put('/:id/status', updateScheduleStatus);

export default router;