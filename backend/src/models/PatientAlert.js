import mongoose from 'mongoose';

const patientAlertSchema = new mongoose.Schema({
    patient_id: { type: String, required: true },
    alert_type: String,
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
    message: String,
    status: { type: String, default: 'active' },
    created_at: { type: Date, default: Date.now }
});

const PatientAlert = mongoose.model('PatientAlert', patientAlertSchema);
export default PatientAlert;
