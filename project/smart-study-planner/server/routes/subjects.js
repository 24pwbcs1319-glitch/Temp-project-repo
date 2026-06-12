import { Router } from 'express';
import Subject from '../models/Subject.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Apply auth middleware to protect all subject routes
router.use(authMiddleware);

/**
 * @route GET /api/subjects
 * @desc Gets all subjects added by the logged-in user
 */
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.user?.id }).sort({ name: 1 });
    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route POST /api/subjects
 * @desc Creates a new subject for the logged-in user
 */
router.post('/', async (req, res) => {
  try {
    const { name, color } = req.body;
    
    if (!name) {
      res.status(400).json({ message: 'Subject name is required' });
      return;
    }

    const newSubject = new Subject({
      name,
      color: color || '#4f46e5',
      userId: req.user?.id,
    });

    const savedSubject = await newSubject.save();
    res.status(201).json(savedSubject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route DELETE /api/subjects/:id
 * @desc Deletes a specific subject owned by the logged-in user
 */
router.delete('/:id', async (req, res) => {
  try {
    const subject = await Subject.findOneAndDelete({ _id: req.params.id, userId: req.user?.id });
    
    if (!subject) {
      res.status(404).json({ message: 'Subject not found' });
      return;
    }

    res.json({ message: 'Subject removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
