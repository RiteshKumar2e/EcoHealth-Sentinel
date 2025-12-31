import express from 'express';
import {
    getHealthcareDashboard,
    scheduleAppointment,
    getAppointments,
    submitVitalSigns,
    aiDiagnosisAssistant
} from '../controllers/healthcareController.js';

const router = express.Router();

router.get('/dashboard', getHealthcareDashboard);
router.post('/appointments', scheduleAppointment);
router.get('/appointments', getAppointments);
router.post('/remote-monitoring', submitVitalSigns);
router.post('/diagnosis-assistant', aiDiagnosisAssistant);

export default router;
