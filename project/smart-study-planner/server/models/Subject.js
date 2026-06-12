import mongoose, { Schema } from 'mongoose';

/**
 * Mongoose Schema for Subject data structure
 */
const SubjectSchema = new Schema({
  name: { type: String, required: true },
  color: { type: String, default: '#4f46e5' }, // Default tailwind indigo-600
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model('Subject', SubjectSchema);
