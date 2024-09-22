import Schedule from '..//models/Schedule.js';

/**
 * Get the start of the current week (assumed to be Monday).
 * @param {Date} date - The reference date (usually today).
 * @returns {Date} - The date representing the start of the current week (Monday).
 */
export const getStartOfCurrentWeek = (date = new Date()) => {
  const currentDate = new Date(date);
  const dayOfWeek = currentDate.getDay();  // Get the current day of the week (0-6)
  const difference = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);  // Adjust if today is Sunday (0) to consider Monday (1) as start
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - difference);
  weekStart.setHours(0, 0, 0, 0);  // Set time to midnight
  return weekStart;
};

/**
 * Get the next available week for schedule generation.
 * It calculates the next Monday after the current week.
 * @returns {Date} - The date representing the start of the next available week (Monday).
 */
export const getNextAvailableWeekStart = async () => {
  const currentWeekStart = getStartOfCurrentWeek();

  // Check if any schedules exist for the current week or next weeks
  const existingSchedules = await Schedule.find({
    week_start: { $gte: currentWeekStart },
  }).sort({ week_start: -1 }).limit(1);  // Sort to get the most recent schedule

  if (existingSchedules.length > 0) {
    // If we already have schedules for a future week, get the next week after that
    const lastScheduledWeek = existingSchedules[0].week_start;
    const nextWeekStart = new Date(lastScheduledWeek);
    nextWeekStart.setDate(lastScheduledWeek.getDate() + 7);  // Move to the next week (7 days ahead)
    return nextWeekStart;
  }

  // If no future schedules exist, return the next week after the current week
  const nextAvailableWeekStart = new Date(currentWeekStart);
  nextAvailableWeekStart.setDate(currentWeekStart.getDate() + 7);
  return nextAvailableWeekStart;
};

/**
 * Get the exact date for each day of the week based on a given weekStart date.
 * @param {Date} weekStart - The start date of the week (usually a Monday).
 * @returns {Object} - Object mapping day names to actual dates.
 */
export const getWeekDays = (weekStart) => {
    const days = {
      monday: new Date(weekStart),
      tuesday: new Date(weekStart),
      wednesday: new Date(weekStart),
      thursday: new Date(weekStart),
      friday: new Date(weekStart),
      saturday: new Date(weekStart),
      sunday: new Date(weekStart),
    };
  
    Object.keys(days).forEach((day, index) => {
      days[day].setDate(weekStart.getDate() + index);  
    });
  
    return days;
  };