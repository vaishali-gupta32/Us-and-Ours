import mongoose from 'mongoose';

const ListItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
    },
    type: {
        type: String,
        enum: ['movie', 'song'],
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed'], // pending = to watch/listen, completed = watched/listened
        default: 'pending',
    },
    link: {
        type: String, // Optional link to Spotify/IMDb
        default: '',
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true });

export default mongoose.models.ListItem || mongoose.model('ListItem', ListItemSchema);
