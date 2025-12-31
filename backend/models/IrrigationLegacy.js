import mongoose from 'mongoose';

const irrigationLegacySchema = new mongoose.Schema({
    farm_id: String,
    crop_type: String,
    date: { type: Date, default: Date.now },
    amount: Number
});

const IrrigationLegacy = mongoose.model('IrrigationLegacy', irrigationLegacySchema);
export default IrrigationLegacy;
