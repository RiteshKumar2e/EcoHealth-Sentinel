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
    deleteTreatment,
    getReports,
    generateReport,
    deleteReport
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

// Reports
router.get('/reports', getReports);
router.post('/reports', generateReport);
router.delete('/reports/:id', deleteReport);

export default router;
