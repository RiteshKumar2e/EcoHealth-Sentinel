import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    patient_id: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    age: Number,
    gender: String,
    contact: String,
    created_at: { type: Date, default: Date.now }
});

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
