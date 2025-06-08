import mongoose from 'mongoose';

export interface INote extends mongoose.Document {
  title: string;
  content: string;
  user: mongoose.Types.ObjectId;
}

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export const Note = mongoose.model<INote>('Note', noteSchema);
