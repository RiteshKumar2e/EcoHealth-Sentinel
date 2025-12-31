import mongoose from 'mongoose';

const disasterPredictionSchema = new mongoose.Schema({
    disaster_type: String,
    location: String,
    risk_level: String,
    probability: Number,
    time_window: String,
    severity_estimate: String,
    prediction_timestamp: { type: Date, default: Date.now }
});

const DisasterPrediction = mongoose.model('DisasterPrediction', disasterPredictionSchema);
export default DisasterPrediction;
