import TimeOffRequest from '../../models/TimeOffRequest.js';
import User from '../../models/User.js';

// @desc    Create a new time-off request
// @route   POST /timeoff
 const createTimeOffRequest = async (req, res) => {
  const { userId, requested_date } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const timeOffRequest = new TimeOffRequest({
      user: userId,
      requested_date,
      approved: false,  // Time off is not approved by default
    });

    const savedTimeOffRequest = await timeOffRequest.save();
    res.status(201).json(savedTimeOffRequest);
  } catch (err) {
    res.status(500).json({ message: 'Error creating time-off request', error: err.message });
  }
};

// @desc    Get all time-off requests
// @route   GET /timeoff
const getTimeOffRequests = async (req, res) => {
  try {
    const timeOffRequests = await TimeOffRequest.find()
      .populate('user', 'name email');

    res.json(timeOffRequests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching time-off requests', error: err.message });
  }
};

// @desc    Approve a time-off request
// @route   PUT /timeoff/:id/approve
 const approveTimeOffRequest = async (req, res) => {
  try {
    const timeOffRequest = await TimeOffRequest.findById(req.params.id);

    if (!timeOffRequest) {
      return res.status(404).json({ message: 'Time-off request not found' });
    }

    timeOffRequest.approved = true;
    const updatedRequest = await timeOffRequest.save();
    res.json(updatedRequest);
  } catch (err) {
    res.status(500).json({ message: 'Error approving time-off request', error: err.message });
  }
};

export default {
    createTimeOffRequest,
    getTimeOffRequests,
    approveTimeOffRequest,

};