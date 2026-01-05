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

// Legacy/Compatibility routes for MyScans
import { getAnalyses, getStats, uploadScan, chatWithAssistant } from '../controllers/healthcareController.js';
router.get('/analyses', getAnalyses);
router.get('/stats', getStats);
router.post('/upload', uploadScan);
router.post('/chat', chatWithAssistant);

export default router;
