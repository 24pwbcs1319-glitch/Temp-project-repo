import { Router } from 'express';
import Task from '../models/Task.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Apply auth middleware to protect all task routes
router.use(authMiddleware);

/**
 * @route GET /api/tasks
 * @desc Gets all tasks for the logged-in user
 */
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user?.id }).populate('subject').sort({ deadline: 1 });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route POST /api/tasks
 * @desc Creates a new task assigned to the logged-in user
 */
router.post('/', async (req, res) => {
  try {
    const { title, subject, deadline } = req.body;
    
    if (!title || !subject || !deadline) {
      res.status(400).json({ message: 'Please provide all required fields' });
      return;
    }

    const newTask = new Task({
      title,
      subject,
      deadline,
      userId: req.user?.id,
    });

    const savedTask = await newTask.save();
    const populated = await savedTask.populate('subject');
    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route PUT /api/tasks/:id
 * @desc Updates the details or completion status of an existing task
 */
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user?.id });
    
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;
    
    if (req.body.title) task.title = req.body.title;
    if (req.body.deadline) task.deadline = req.body.deadline;
    if (req.body.subject) task.subject = req.body.subject;

    const updatedTask = await task.save();
    const populated = await updatedTask.populate('subject');
    res.json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route DELETE /api/tasks/:id
 * @desc Deletes a task owned by the logged-in user
 */
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user?.id });
    
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    
    res.json({ message: 'Task removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
