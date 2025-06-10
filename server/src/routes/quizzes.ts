import express, { Request, Response } from 'express';
import { auth } from '../middleware/auth';
import { Note } from '../models/Note';
import { Quiz } from '../models/Quiz';
import { generateQuestions } from '../services/quizService';

const router = express.Router();

router.post('/notes/:noteId/quiz', auth, async (req: Request, res: Response) => {
	try {
		const note = await Note.findOne({ _id: req.params.noteId, user: req.user.id });
		if (!note) {
			return res.status(404).json({ message: 'Note not found' });
		}

		const questions = await generateQuestions(note);

		const quiz = new Quiz({
			noteId: note._id,
			userId: req.user.id,
			questions,
		});

		await quiz.save();
		res.status(201).json(quiz);
	} catch (error) {
		console.error('Error creating quiz:', error);
		res.status(500).json({ message: 'Error creating quiz' + error });
	}
});

router.get('/notes/:noteId/quizzes', auth, async (req: Request, res: Response) => {
	try {
		const quizzes = await Quiz.find({
			noteId: req.params.noteId,
			userId: req.user.id
		}).sort({ createdAt: -1 });

		res.json(quizzes);
	} catch (error) {
		console.error('Error fetching quizzes:', error);
		res.status(500).json({ message: 'Error fetching quizzes' });
	}
});

router.get('/quizzes/:quizId', auth, async (req: Request, res: Response) => {
	try {
		const quiz = await Quiz.findOne({
			_id: req.params.quizId,
			userId: req.user.id
		});

		if (!quiz) {
			return res.status(404).json({ message: 'Quiz not found' });
		}

		res.json(quiz);
	} catch (error) {
		console.error('Error fetching quiz:', error);
		res.status(500).json({ message: 'Error fetching quiz' });
	}
});

export default router;
