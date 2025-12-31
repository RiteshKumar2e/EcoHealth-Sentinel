import mongoose from 'mongoose';

const carbonCalculationSchema = new mongoose.Schema({
    activity_type: String,
    value: Number,
    unit: String,
    result: Object,
    timestamp: { type: Date, default: Date.now }
});

const CarbonCalculation = mongoose.model('CarbonCalculation', carbonCalculationSchema);
export default CarbonCalculation;
