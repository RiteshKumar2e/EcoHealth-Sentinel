import mongoose from 'mongoose';

const resourceDataSchema = new mongoose.Schema({
    resource: String,
    current: Number,
    predicted: Number,
    capacity: Number,
    timestamp: { type: Date, default: Date.now },
});

const ResourceData = mongoose.model('ResourceData', resourceDataSchema);
export default ResourceData;
