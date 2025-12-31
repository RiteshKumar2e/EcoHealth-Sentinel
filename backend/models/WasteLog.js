import mongoose from 'mongoose';

const wasteLogSchema = new mongoose.Schema({
    waste_type: String,
    quantity: Number,
    unit: String,
    recyclable_amount: Number,
    timestamp: { type: Date, default: Date.now }
});

const WasteLog = mongoose.model('WasteLog', wasteLogSchema);
export default WasteLog;
