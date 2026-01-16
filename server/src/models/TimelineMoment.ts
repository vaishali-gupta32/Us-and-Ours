import mongoose, { Schema, Document } from 'mongoose';

export interface ITimelineMoment extends Document {
    coupleId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    date: Date;
    image?: string;
    iconType: 'heart' | 'ring' | 'plane' | 'home' | 'star' | 'camera';
    createdAt: Date;
}

const TimelineMomentSchema: Schema = new Schema({
    coupleId: { type: Schema.Types.ObjectId, ref: 'Couple', required: true },
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    image: { type: String },
    iconType: {
        type: String,
        enum: ['heart', 'ring', 'plane', 'home', 'star', 'camera'],
        default: 'heart'
    }
}, { timestamps: true });

export default mongoose.model<ITimelineMoment>('TimelineMoment', TimelineMomentSchema);
