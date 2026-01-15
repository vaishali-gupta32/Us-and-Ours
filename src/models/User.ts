import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        maxlength: [20, 'Name cannot be more than 20 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    avatar: {
        type: String,
        default: '',
    },
    partnerEmail: { // Deprecated in favor of coupleId, keeping for backward compat
        type: String,
        default: '',
    },
    coupleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Couple',
        default: null,
    }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
