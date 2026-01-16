import mongoose from 'mongoose';

const CoupleSchema = new mongoose.Schema({
    partner1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    partner2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    secretCode: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Couple || mongoose.model('Couple', CoupleSchema);
