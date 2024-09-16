import Task from "../../models/Task.js";

// @desc    Create a new task
// @route   POST /tasks
const createTask = async (req, res) => {
  const { task_name, description} = req.body;

  try {
    const task = new Task({ task_name, description});
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task', error: err.message });
  }
};

// @desc    Get all tasks
// @route   GET /tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

const getTaskById = async(req, res) =>{
  try{
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { task, description } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, { task, description }, { new: true });
    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

 const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

const getPredefinedTasks = async (req, res) => {
  try {
    res.status(200).json(Task.PREDEFINED_TASKS);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching predefined tasks', error: error.message });
  }
};

export default { 
  createTask, 
  getTasks,
  getTaskById,
  updateTask, 
  deleteTask,
  getPredefinedTasks
};
