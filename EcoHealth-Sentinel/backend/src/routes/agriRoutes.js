import express from 'express';
import { getAgriDashboard, detectCropDisease, getMarketForecast } from '../controllers/agriController.js';

const router = express.Router();

router.get('/dashboard', getAgriDashboard);
router.post('/crop-disease-detection', detectCropDisease);
router.get('/market/forecast', getMarketForecast);

export default router;
