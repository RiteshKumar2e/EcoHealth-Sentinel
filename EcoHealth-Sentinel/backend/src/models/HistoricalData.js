import mongoose from 'mongoose';

const historicalDataSchema = new mongoose.Schema({
    hour: String,
    actual: Number,
    predicted: Number,
    capacity: Number,
    x: Number,
    y: Number,
    date: { type: Date, default: Date.now },
});

const HistoricalData = mongoose.model('HistoricalData', historicalDataSchema);
export default HistoricalData;
