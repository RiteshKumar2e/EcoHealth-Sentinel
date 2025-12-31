import mongoose from 'mongoose';

const categoryDataSchema = new mongoose.Schema({
    category: String,
    current: Number,
    predicted: Number,
    timestamp: { type: Date, default: Date.now },
});

const CategoryData = mongoose.model('CategoryData', categoryDataSchema);
export default CategoryData;
