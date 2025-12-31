import mongoose from 'mongoose';

const vitalSignsSchema = new mongoose.Schema({
    patient_id: { type: String, required: true },
    heart_rate: Number,
    blood_pressure: String,
    temperature: Number,
    oxygen_saturation: Number,
    respiratory_rate: Number,
    timestamp: { type: Date, default: Date.now }
});

const VitalSigns = mongoose.model('VitalSigns', vitalSignsSchema);
export default VitalSigns;
