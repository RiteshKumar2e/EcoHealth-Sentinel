import EmergencyMetrics from '../models/EmergencyMetrics.js';
import Prediction from '../models/Prediction.js';
import HistoricalData from '../models/HistoricalData.js';
import CategoryData from '../models/CategoryData.js';
import ResourceData from '../models/ResourceData.js';
import Notification from '../models/Notification.js';

export const getMetrics = async (req, res, next) => {
    try {
        const metrics = await EmergencyMetrics.findOne().sort({ timestamp: -1 });
        res.json(metrics || {
            currentLoad: 23,
            predictedPeak: 45,
            avgResponseTime: 8.5,
            bedAvailability: 76,
            timestamp: new Date(),
        });
    } catch (error) {
        next(error);
    }
};

export const createMetrics = async (req, res, next) => {
    try {
        const metrics = new EmergencyMetrics(req.body);
        await metrics.save();
        res.json(metrics);
    } catch (error) {
        next(error);
    }
};

export const getPredictions = async (req, res, next) => {
    try {
        const { timeframe, riskLevel } = req.query;
        let query = {};
        if (riskLevel && riskLevel !== 'all') {
            query.riskLevel = riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);
        }
        const predictions = await Prediction.find(query).sort({ timestamp: -1 }).limit(10);
        res.json(predictions);
    } catch (error) {
        next(error);
    }
};

export const createPrediction = async (req, res, next) => {
    try {
        const prediction = new Prediction(req.body);
        await prediction.save();

        if (prediction.riskLevel === 'High' && prediction.probability > 75) {
            const notification = new Notification({
                title: 'High Risk Alert',
                message: `${prediction.type} predicted with ${prediction.probability}% probability`,
                priority: 'high',
            });
            await notification.save();
        }
        res.json(prediction);
    } catch (error) {
        next(error);
    }
};

export const getHistoricalData = async (req, res, next) => {
    try {
        const data = await HistoricalData.find().sort({ date: -1 }).limit(24);
        res.json(data);
    } catch (error) {
        next(error);
    }
};

export const getCategoryData = async (req, res, next) => {
    try {
        const data = await CategoryData.find().sort({ timestamp: -1 }).limit(5);
        res.json(data);
    } catch (error) {
        next(error);
    }
};

export const getResourceData = async (req, res, next) => {
    try {
        const data = await ResourceData.find().sort({ timestamp: -1 }).limit(10);
        res.json(data);
    } catch (error) {
        next(error);
    }
};

export const getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find().sort({ timestamp: -1 }).limit(20);
        res.json(notifications);
    } catch (error) {
        next(error);
    }
};
