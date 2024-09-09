import Schedule from '../../../models/Schedule.js';
import User from '../../../models/User.js';
import Task from '../../../models/Task.js';

// @desc    Create a new schedule
// @route   POST /schedules
const createSchedule = async (req, res) => {
  const { userId, taskId, date, is_approved } = req.body;

  try {
    // Validate that the user and task exist
    const user = await User.findById(userId);
    const task = await Task.findById(taskId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const schedule = new Schedule({
      user: userId,
      task: taskId,
      date,
      is_approved: is_approved || false,  // By default, not approved
    });

    const savedSchedule = await schedule.save();
    res.status(201).json(savedSchedule);
  } catch (err) {
    res.status(500).json({ message: 'Error creating schedule', error: err.message });
  }
};

// @desc    Get all schedules
// @route   GET /schedules
const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate('user', 'name email')  // Populate the user fields
      .populate('task', 'task_name description');  // Populate the task fields

    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching schedules', error: err.message });
  }
};

// @desc    Approve a schedule
// @route   PUT /schedules/:id/approve
 const approveSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    schedule.is_approved = true;
    const updatedSchedule = await schedule.save();
    res.json(updatedSchedule);
  } catch (err) {
    res.status(500).json({ message: 'Error approving schedule', error: err.message });
  }
};

export default{
    createSchedule,
    getSchedules,
    approveSchedule
};
