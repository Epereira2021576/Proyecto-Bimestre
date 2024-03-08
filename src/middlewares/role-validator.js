import User from '../users/user.model.js';

export const validationOfRole = async (req, res, next) => {
  const { ...rest } = req.body;

  try {
    let userID = rest.userID;
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'ADMIN_ROLE') {
      return res.status(403).json({
        message: 'You do not have permission to access this function',
      });
    }

    next();
  } catch (e) {
    console.log('Unexpected error:', e);
    res.status(500).json({ message: 'Internal server error' });
  }
};
