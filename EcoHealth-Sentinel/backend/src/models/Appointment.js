import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    patient_id: { type: String, required: true },
    patient_name: String,
    doctor_id: { type: String, required: true },
    doctor_name: String,
    appointment_date: { type: Date, required: true },
    time: String,
    reason: String,
    type: { type: String, default: 'general' },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
    created_at: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
