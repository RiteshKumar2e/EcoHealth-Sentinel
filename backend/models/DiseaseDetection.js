import mongoose from 'mongoose';

const diseaseDetectionSchema = new mongoose.Schema({
    disease_name: String,
    confidence: Number,
    severity: String,
    detected_at: { type: Date, default: Date.now },
    image_name: String
});

const DiseaseDetection = mongoose.model('DiseaseDetection', diseaseDetectionSchema);
export default DiseaseDetection;
