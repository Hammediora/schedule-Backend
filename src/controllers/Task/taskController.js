import Task from "../../../models/Task.js";

// @desc    Create a new task
// @route   POST /tasks
const createTask = async (req, res) => {
  const { task_name, description, priority, deadline } = req.body;

  try {
    const task = new Task({ task_name, description, priority, deadline });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task' });
  }
};

// @desc    Get all tasks
// @route   GET /tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

export default { 
  createTask, 
  getTasks,
};
