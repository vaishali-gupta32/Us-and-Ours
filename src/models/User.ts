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
    partnerEmail: { // We will use this to link the two users
        type: String,
        default: '',
    }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
