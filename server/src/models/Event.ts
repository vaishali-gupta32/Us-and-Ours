import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
    title: string;
    date: string;
    coupleId: mongoose.Types.ObjectId;
}

const EventSchema: Schema = new Schema({
    title: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    coupleId: { type: Schema.Types.ObjectId, ref: 'Couple', required: true }
}, { timestamps: true });

export default mongoose.model<IEvent>('Event', EventSchema);
