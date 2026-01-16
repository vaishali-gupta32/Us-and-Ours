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
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    googleAccessToken: {
        type: String
    },
    googleRefreshToken: {
        type: String
    }
}, { timestamps: true });

export interface IUser extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    googleId?: string;
    googleAccessToken?: string;
    googleRefreshToken?: string;
    coupleId?: mongoose.Types.ObjectId;
}

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
