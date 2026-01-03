import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    date: {
        type: String, // String format for UI consistency or Date
        required: true
    },
    size: {
        type: String,
        default: '1.5 MB'
    },
    status: {
        type: String,
        default: 'Ready'
    },
    data: {
        type: Object, // To store specific metrics if needed
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
