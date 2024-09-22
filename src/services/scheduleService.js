import User from '../../models/User.js';
import Schedule from '../../models/Schedule.js';
import Task from '../../models/Task.js';
import { getStartOfCurrentWeek, getNextAvailableWeekStart, getWeekDays } from '../../utils/dateHelpers.js';

/**
 * Generate weekly schedules based on projected sales and employee availability, while assigning tasks based on roles.
 * @param {Object} salesData - Contains projected sales for each day of the week.
 * @param {Date} requestedWeekStart - The start date of the week for which schedules are being generated.
 * @returns {Array} - Generated schedule data.
 */
const generateWeeklySchedules = async (salesData, requestedWeekStart) => {
  try {
    const currentWeekStart = getStartOfCurrentWeek(new Date());
    const nextAvailableWeekStart = await getNextAvailableWeekStart();

    // Ensure that schedules are not generated for past weeks
    if (requestedWeekStart < currentWeekStart) {
      throw new Error('Cannot generate schedules for past weeks.');
    }

    // Ensure that schedules are generated for the next available or future weeks
    if (requestedWeekStart < nextAvailableWeekStart) {
      throw new Error(`Cannot generate schedules for previous weeks. The next available week starts on ${nextAvailableWeekStart}.`);
    }

    const daysOfWeek = Object.keys(salesData);  // e.g., ['monday', 'tuesday', ...]
    const schedules = [];

    // Ensure the predefined tasks are available in the database
    const predefinedTasks = await ensurePredefinedTasks();

    // Get the exact dates for each day of the week based on the requested weekStart
    const days = getWeekDays(requestedWeekStart);

    for (const day of daysOfWeek) {
      const projectedSales = salesData[day.toLowerCase()];
      let numEmployees = 0;

      // Determine number of employees needed based on sales projections
      if (projectedSales > 6000) {
        numEmployees = 12;  // 6 AM + 6 PM
      } else if (projectedSales > 4000) {
        numEmployees = 8;  // 4 AM + 4 PM
      } else {
        numEmployees = 4;  
      }

      const employeesPerShift = numEmployees / 2;

      // Fetch all users who are available for the current day
      const availableUsers = await User.find({
        [`availability.${day}.off`]: false, 
      }).select('role availability shift_preferences');

      let amShiftEmployees = 0;
      let pmShiftEmployees = 0;

      // Assign tasks and shifts to available employees
      for (const user of availableUsers) {
        if (amShiftEmployees >= employeesPerShift && pmShiftEmployees >= employeesPerShift) {
          break; 
        }

        const userAvailability = user.availability[day];
        const shiftPreference = user.shift_preferences || 'morning';  // Default to morning if no preference
        const task = assignTaskBasedOnRole(user.role, predefinedTasks);

        const dateForShift = days[day.toLowerCase()];  // Get the exact date for the day

        // If user prefers morning and there's space in the AM shift
        if (amShiftEmployees < employeesPerShift && shiftPreference === 'morning') {
          schedules.push({
            user: user._id,
            task: task._id,
            shift: {
              day: day,
              date: dateForShift,
              start_time: userAvailability.start || '08:00',
              end_time: userAvailability.end || '14:00',
            },
            week_start: requestedWeekStart,
            week_end: days.sunday,
            projected_sales: projectedSales,
            is_approved: true,
          });
          amShiftEmployees++;
        }
        // If user prefers afternoon and there's space in the PM shift
        else if (pmShiftEmployees < employeesPerShift && shiftPreference === 'afternoon') {
          schedules.push({
            user: user._id,
            task: task._id,
            shift: {
              day: day,
              date: dateForShift,
              start_time: userAvailability.start || '14:00',
              end_time: userAvailability.end || '20:00',
            },
            week_start: requestedWeekStart,
            week_end: days.sunday,
            projected_sales: projectedSales,
            is_approved: true,
          });
          pmShiftEmployees++;
        }
      }

      // Save all the schedules for the day
      for (const schedule of schedules) {
        const newSchedule = new Schedule(schedule);
        await newSchedule.save();
      }
    }

    return schedules;  // Return all the generated schedules
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate schedules');
  }
};

/**
 * Assign tasks based on the user's role.
 * @param {String} role - The role of the employee (e.g., 'general manager', 'crew member').
 * @param {Object} predefinedTasks - The predefined tasks from the database.
 * @returns {Object} - A task assigned to the employee based on their role.
 */
const assignTaskBasedOnRole = (role, predefinedTasks) => {
  switch (role) {
    case 'general manager':
    case 'service manager':
      return predefinedTasks.MANAGER;
    case 'kitchen manager':
      return Math.random() < 0.5 ? predefinedTasks.PREP : predefinedTasks.GRILL;
    case 'crew member':
      const crewTasks = [predefinedTasks.LINE, predefinedTasks.CASHIER, predefinedTasks.PREP, predefinedTasks.GRILL];
      return crewTasks[Math.floor(Math.random() * crewTasks.length)];
    default:
      return predefinedTasks.LINE;  // Default to LINE task if no role is defined
  }
};

/**
 * Ensure that predefined tasks are available in the database.
 * @returns {Object} - A map of predefined tasks.
 */
const ensurePredefinedTasks = async () => {
  const taskMap = {};

  // Check if the predefined tasks already exist
  for (const [key, taskData] of Object.entries(Task.PREDEFINED_TASKS)) {
    let task = await Task.findOne({ task_name: taskData.name });
    if (!task) {
      task = new Task(taskData);
      await task.save();
    }
    taskMap[key] = task;
  }

  return taskMap;
};

export default generateWeeklySchedules;
