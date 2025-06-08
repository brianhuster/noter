import express from 'express';
import { auth } from '../middleware/auth';
import { Note } from '../models/Note';

const router = express.Router();

// Get all notes for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id}).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = new Note({
      title,
      content,
      user: req.user.id,
    });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: 'Error creating note' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching note' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, content },
      { new: true }
    );
    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }
    res.json(note);
  } catch (error) {
    res.status(400).json({ message: 'Error updating note' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    return res.json({ message: 'Note deleted' });
  } catch (error) {
    console.error('Error deleting note:', error);
    return res.status(500).json({ message: 'Error deleting note' });
    res.status(500).json({ message: 'Error deleting note' });
  }
});

export default router;
