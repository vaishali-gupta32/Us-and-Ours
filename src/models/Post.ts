import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: [true, 'Please write something...'],
    },
    mood: {
        type: String,
        enum: ['happy', 'sad', 'excited', 'tired', 'romantic', 'angry', 'chill'],
        default: 'happy',
    },
    images: {
        type: [String], // Array of URLs
        default: [],
    },
    date: { // distinct from createdAt: user can backdate/journal about a past day
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
