import express from 'express';
import {
    getHealthcareDashboard,
    scheduleAppointment,
    getAppointments,
    submitVitalSigns,
    aiDiagnosisAssistant
} from '../controllers/healthcareController.js';
import { validateAppointment } from '../middlewares/validation.js';

const router = express.Router();

router.get('/dashboard', getHealthcareDashboard);
router.post('/appointments', validateAppointment, scheduleAppointment);
router.get('/appointments', getAppointments);
router.post('/remote-monitoring', submitVitalSigns);
router.post('/diagnosis-assistant', aiDiagnosisAssistant);

export default router;
