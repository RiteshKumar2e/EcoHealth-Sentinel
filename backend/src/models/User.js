import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    domain: { type: String },
    status: { type: String, default: 'active' },
    permissions: [String],
    lastAccess: String,
    lastLogin: Date,
    ipAddress: String,
    loginCount: { type: Number, default: 0 },
    failedAttempts: { type: Number, default: 0 },
    location: String,
    phone: String,
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
export default User;
