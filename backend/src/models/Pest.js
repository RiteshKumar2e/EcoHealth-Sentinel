import mongoose from 'mongoose';

const pestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    severity: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
    crops: [String],
    symptoms: String,
    organicControl: [String],
    chemicalControl: String,
    prevention: String,
    aiDetection: Number, // Percentage accuracy
    image: String // Emoji or URL
});

const Pest = mongoose.model('Pest', pestSchema);
export default Pest;
