import mongoose from 'mongoose';

const treatmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional for now if no auth
    pest: { type: String, required: true },
    treatment: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['scheduled', 'completed', 'missed'], default: 'scheduled' },
    area: String,
    notes: String,
    createdAt: { type: Date, default: Date.now }
});

const Treatment = mongoose.model('Treatment', treatmentSchema);
export default Treatment;
