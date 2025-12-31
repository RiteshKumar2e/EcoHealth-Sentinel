import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialization: String,
    contact: String,
    status: { type: String, default: 'available' },
    created_at: { type: Date, default: Date.now }
});

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
