import mongoose from 'mongoose';

const emergencyMetricsSchema = new mongoose.Schema({
    currentLoad: Number,
    predictedPeak: Number,
    avgResponseTime: Number,
    bedAvailability: Number,
    timestamp: { type: Date, default: Date.now },
});

const EmergencyMetrics = mongoose.model('EmergencyMetrics', emergencyMetricsSchema);
export default EmergencyMetrics;
