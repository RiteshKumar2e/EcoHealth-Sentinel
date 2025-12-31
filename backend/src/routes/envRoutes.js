import express from 'express';
import { getEnvDashboard, calculateCarbon } from '../controllers/envController.js';

const router = express.Router();

router.get('/dashboard', getEnvDashboard);
router.post('/carbon-calculation', calculateCarbon);

export default router;
