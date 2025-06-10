import express from 'express';
import { Note } from '../models/Note';
import { User } from '../models/User';
import { Quiz } from '../models/Quiz';

const router = express.Router();

// For development only
if (process.env.NODE_ENV !== 'production') {
    router.get('/users', async (req, res) => {
        try {
            const users = await User.find({}).select('-password');
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users' });
        }
    });

    router.get('/notes', async (req, res) => {
        try {
            const notes = await Note.find({});
            res.json(notes);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching notes' });
        }
    });

    router.get('/quizzes', async (req, res) => {
        try {
            const quizzes = await Quiz.find({});
            res.json(quizzes);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching quizzes' });
        }
    });

    // Get all data for a specific user
    router.get('/users/:userId/data', async (req, res) => {
        try {
            const user = await User.findById(req.params.userId).select('-password');
            const notes = await Note.find({ user: req.params.userId });
            const quizzes = await Quiz.find({ userId: req.params.userId });
            res.json({ user, notes, quizzes });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching user data' });
        }
    });
}

export default router;
