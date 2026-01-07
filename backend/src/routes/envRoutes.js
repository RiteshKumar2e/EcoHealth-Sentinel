import express from 'express';
import { getEnvDashboard, calculateCarbon } from '../controllers/envController.js';
import { validateCarbonCalculation } from '../middlewares/validation.js';

const router = express.Router();

router.get('/dashboard', getEnvDashboard);
router.post('/carbon-calculation', validateCarbonCalculation, calculateCarbon);

export default router;
