import mongoose, { Schema } from 'mongoose';

/**
 * Mongoose Schema for Task data structure
 */
const TaskSchema = new Schema({
  title: { type: String, required: true },
  subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  deadline: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model('Task', TaskSchema);
