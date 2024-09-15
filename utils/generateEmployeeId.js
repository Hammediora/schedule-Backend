import User from '../models/User.js';

// Function to generate a unique Employee ID
export const generateEmployeeId = async (firstName, lastName) => {
  const initials = firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();

  // Generate a random 5-digit number
  const randomNumber = Math.floor(10000 + Math.random() * 90000); // Generates a number between 10000 and 99999

  const employeeId = `${initials}${randomNumber}`;

  // Check if the generated employeeId already exists in the database
  const existingUser = await User.findOne({ employeeId });
  if (existingUser) {
    // Recursively generate a new ID if the one generated is not unique
    return generateEmployeeId(firstName, lastName);
  }

  return employeeId;
};
