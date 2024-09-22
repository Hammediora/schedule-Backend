import generateWeeklySchedules from '../services/scheduleService.js';
import Schedule from '../../models/Schedule.js';
import { getNextAvailableWeekStart, getStartOfCurrentWeek } from '../../utils/dateHelpers.js';

/**
 * @desc    Generate weekly schedules based on projected sales and employee availability
 * @route   POST /schedules/generate-weekly
 */
const generateSchedulesForWeek = async (req, res) => {
  try {
    const { salesData, weekStart } = req.body;  // Expected: { salesData: {...}, weekStart: "YYYY-MM-DD" }

    // Validate that sales data and week start date are provided
    if (!salesData || Object.keys(salesData).length === 0 || !weekStart) {
      return res.status(400).json({ message: 'Sales data and week start date are required to generate schedules' });
    }

    const requestedWeekStart = new Date(weekStart);  // Convert the week start string into a Date object

    // Validate that the requested week start is not in the past
    const currentWeekStart = getStartOfCurrentWeek(new Date());
    const nextAvailableWeekStart = await getNextAvailableWeekStart();

    if (requestedWeekStart < currentWeekStart) {
      return res.status(400).json({ message: 'Cannot generate schedules for past weeks.' });
    }

    if (requestedWeekStart < nextAvailableWeekStart) {
      return res.status(400).json({ message: `Cannot generate schedules for previous weeks. The next available week starts on ${nextAvailableWeekStart}.` });
    }

    // Call the service to generate schedules for the given week
    const schedules = await generateWeeklySchedules(salesData, requestedWeekStart);

    // Return the generated schedules
    return res.status(201).json(schedules);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to generate schedules', error: error.message });
  }
};

/**
 * @desc    Get all schedules or schedules for a specific week
 * @route   GET /schedules
 */
const getSchedules = async (req, res) => {
  try {
    const { weekStart } = req.query;  // Optional query parameter to filter schedules by week

    let filter = {};
    if (weekStart) {
      const weekStartDate = new Date(weekStart);
      const weekEndDate = new Date(weekStart);
      weekEndDate.setDate(weekStartDate.getDate() + 6);  // Calculate the end date of the week

      filter = {
        week_start: { $gte: weekStartDate, $lte: weekEndDate },
      };
    }

    const schedules = await Schedule.find(filter)
      .populate('user', 'name email role')  // Populate user fields
      .populate('task', 'task_name description');  // Populate task fields

    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching schedules', error: err.message });
  }
};

/**
 * @desc    Approve a schedule
 * @route   PUT /schedules/:id/approve
 */
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

/**
 * @desc    Update a schedule (e.g., edit shift time, task, or feedback)
 * @route   PUT /schedules/:scheduleId
 */
const updateSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { task, shift, feedback } = req.body;  // Expect task, shift, or feedback updates

    // Find the schedule by its ID
    let schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Update task if provided
    if (task) {
      schedule.task = task;
    }

    // Update shift details if provided
    if (shift) {
      schedule.shift = {
        ...schedule.shift,
        ...shift,  // Merges with existing shift data
      };
    }

    // Update feedback if provided
    if (feedback) {
      schedule.feedback = {
        ...schedule.feedback,
        ...feedback,  // Merges with existing feedback data
      };
    }

    // Save the updated schedule
    const updatedSchedule = await schedule.save();
    res.status(200).json(updatedSchedule);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating schedule', error: error.message });
  }
};

/**
 * @desc    Soft delete a schedule (mark it as inactive)
 * @route   DELETE /schedules/:scheduleId
 */
const softDeleteSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    // Find and update the schedule by marking it as inactive
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Mark schedule as inactive instead of deleting
    schedule.is_active = false;
    await schedule.save();

    res.status(200).json({ message: 'Schedule soft-deleted (marked as inactive)' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error soft-deleting schedule', error: error.message });
  }
};

export default {
  softDeleteSchedule,
  generateSchedulesForWeek,
  getSchedules,
  approveSchedule,
  updateSchedule,
};
