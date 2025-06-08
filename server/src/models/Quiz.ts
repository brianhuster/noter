import mongoose from 'mongoose';

export interface IQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface IQuiz extends mongoose.Document {
  noteId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  questions: IQuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const quizSchema = new mongoose.Schema({
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  questions: [{
    question: {
      type: String,
      required: true,
    },
    options: [{
      type: String,
      required: true,
    }],
    correctAnswer: {
      type: Number,
      required: true,
    },
  }],
}, {
  timestamps: true,
});

export const Quiz = mongoose.model<IQuiz>('Quiz', quizSchema);
