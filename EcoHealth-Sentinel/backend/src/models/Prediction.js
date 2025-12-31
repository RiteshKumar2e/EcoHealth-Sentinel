import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
    type: String,
    riskLevel: String,
    probability: Number,
    timeframe: String,
    factors: [String],
    recommendedAction: String,
    confidence: Number,
    affectedArea: String,
    estimatedCases: String,
    timestamp: { type: Date, default: Date.now },
});

const Prediction = mongoose.model('Prediction', predictionSchema);
export default Prediction;
