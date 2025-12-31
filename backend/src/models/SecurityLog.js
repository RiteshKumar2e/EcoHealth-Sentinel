import mongoose from 'mongoose';

const securityLogSchema = new mongoose.Schema({
    type: { type: String, enum: ['success', 'warning', 'danger', 'info'], default: 'info' },
    action: { type: String, required: true },
    user: { type: String, default: 'System' },
    time: String,
    timestamp: { type: Date, default: Date.now },
    ip: String,
    details: String,
    domain: String,
});

const SecurityLog = mongoose.model('SecurityLog', securityLogSchema);
export default SecurityLog;
