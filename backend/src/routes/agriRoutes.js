import express from 'express';
import { getAgriDashboard, detectCropDisease, getMarketForecast, getSupplyChainData, createShipment } from '../controllers/agriController.js';

const router = express.Router();

router.get('/dashboard', getAgriDashboard);
router.post('/crop-disease-detection', detectCropDisease);
router.get('/market/forecast', getMarketForecast);
router.get('/supply-chain', getSupplyChainData);
router.post('/shipment', createShipment);


export default router;
