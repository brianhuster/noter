import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import userRoutes from './routes/users';
import noteRoutes from './routes/notes';
import quizRoutes from './routes/quizzes';
import debugRoutes from './routes/debug';

dotenv.config();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api', quizRoutes);
app.use('/api/debug', debugRoutes);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/noter';
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT} and accessible on your local network`);
});
