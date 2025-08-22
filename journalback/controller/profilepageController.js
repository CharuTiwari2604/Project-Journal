// const User = require('../model/authModel');
// const Journal = require('../model/journalModal');

// exports.getProfileWithJournals = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const user = await User.findById(userId).select('name email');
//     const journals = await Journal.find({ user: userId }).sort({ createdAt: -1 });

//     res.status(200).json({
//       user,
//       journals
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

const User = require('../model/authModel');
const Journal = require('../model/journalModal');

// Get profile with journals
const getProfileWithJournals = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const journals = await Journal.find({ user: req.user._id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user, journals });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Update username
const updateUsername = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: username },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Username updated successfully', user });
  } catch (err) {
    console.error('Error updating username:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProfileWithJournals, updateUsername };
