import express from 'express';
import {
    getHealthcareDashboard,
    scheduleAppointment,
    getAppointments,
    submitVitalSigns,
    aiDiagnosisAssistant,
    getAnalyses,
    getStats,
    uploadScan,
    chatWithAssistant
} from '../controllers/healthcareController.js';
import { validateAppointment } from '../middlewares/validation.js';

const router = express.Router();

router.get('/dashboard', getHealthcareDashboard);
router.post('/appointments', validateAppointment, scheduleAppointment);
router.get('/appointments', getAppointments);
router.post('/remote-monitoring', submitVitalSigns);
router.post('/diagnosis-assistant', aiDiagnosisAssistant);
router.get('/analyses', getAnalyses);
router.get('/stats', getStats);
router.post('/upload-scan', uploadScan);
router.post('/chat', chatWithAssistant);

export default router;
