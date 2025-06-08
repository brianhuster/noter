import express from 'express';
import { auth } from '../middleware/auth';
import { Note } from '../models/Note';

const router = express.Router();

// Get all notes for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

// Create a new note
router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = new Note({
      title,
      content,
      user: req.userId,
    });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: 'Error creating note' });
  }
});

// Get a specific note
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.userId });
    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching note' });
  }
});

// Update a note
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
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

// Delete a note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note' });
  }
});

export default router;
