import { Schema, model } from 'mongoose';

/**
 * appeal mongo database schema's definition
 */
const AppealSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default model('Appeal', AppealSchema);
