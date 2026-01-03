import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    author: { type: String, required: true },
    text: { type: String, required: true },
    userId: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
    author: { type: String, required: true },
    location: { type: String, default: 'India' },
    content: { type: String, required: true },
    category: { type: String, default: 'General' },
    likesCount: { type: Number, default: 0 },
    likedBy: [{ type: String }], // To prevent multiple likes from same user
    comments: [commentSchema],
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);
export default Post;
