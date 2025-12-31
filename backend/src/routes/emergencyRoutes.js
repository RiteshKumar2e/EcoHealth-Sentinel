import express from 'express';
import {
    getMetrics, createMetrics,
    getPredictions, createPrediction,
    getHistoricalData, getCategoryData,
    getResourceData, getNotifications
} from '../controllers/emergencyController.js';

const router = express.Router();

router.get('/metrics', getMetrics);
router.post('/metrics', createMetrics);
router.get('/predictions', getPredictions);
router.post('/predictions', createPrediction);
router.get('/historical', getHistoricalData);
router.get('/categories', getCategoryData);
router.get('/resources', getResourceData);
router.get('/notifications', getNotifications);

export default router;
