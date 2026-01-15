import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    date: { // Stored as ISO string YYYY-MM-DD for easy querying
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['date', 'anniversary', 'reminder'],
        default: 'date'
    }
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
