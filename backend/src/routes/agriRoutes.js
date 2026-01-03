import express from 'express';
import {
    getAgriDashboard,
    detectCropDisease,
    getMarketForecast,
    getSupplyChainData,
    createShipment,
    getPests,
    getTreatments,
    scheduleTreatment,
    updateTreatmentStatus,
    deleteTreatment
} from '../controllers/agriController.js';

const router = express.Router();

router.get('/dashboard', getAgriDashboard);
router.post('/crop-disease-detection', detectCropDisease);
router.get('/market/forecast', getMarketForecast);
router.get('/supply-chain', getSupplyChainData);
router.post('/shipment', createShipment);

// Pest Control & Treatments
router.get('/pests', getPests);
router.get('/treatments', getTreatments);
router.post('/treatments', scheduleTreatment);
router.patch('/treatments/:id/status', updateTreatmentStatus);
router.delete('/treatments/:id', deleteTreatment);

export default router;
