import { request, response } from 'express';
import bcryptjs from 'bcryptjs';
import User from './user.model.js';

//Method to update admin users
export const adminUsersPut = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, status } = req.body;

    const authenticatedUser = req.user;
    const permAdmin = authenticatedUser.role === 'ADMIN_ROLE';

    if (!permAdmin) {
      return res.status(403).json({
        msg: 'You do not have permission to perform this action',
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        msg: 'User not found',
      });
    }

    //Checking for changes in the model
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    if (password) {
      const salt = bcryptjs.genSaltSync();
      user.password = bcryptjs.hashSync(password, salt);
      console.log(`Password updated, user with ID ${id}`);
    }
    if (role) {
      user.role = role;
    }
    await user.save();
    return res.status(200).json({
      msg: `User with ID ${id} updated successfully`,
      user,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      msg: 'Try again',
    });
  }
};

export const clientUsersPut = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, oldPass, newPass } = req.body;

    if (!oldPass || !newPass) {
      return res.status(400).json({
        msg: 'Old and new password are required',
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        msg: 'User not found',
      });
    }

    // Checking if the current password is correct
    const validPass = bcryptjs.compareSync(oldPass, user.password);
    if (!validPass) {
      return res.status(400).json({
        msg: 'Incorrect password',
      });
    }

    if (name) {
      user.name = name;
    }

    const hashedPassword = bcryptjs.hashSync(newPass, 10);
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      msg: 'Profile updated successfully',
      user,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      msg: 'Try again or talk to an administrator',
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const authenticatedUser = req.user;
    const permAdmin = authenticatedUser.role === 'ADMIN_ROLE';

    if (!permAdmin) {
      return res.status(403).json({
        msg: 'You do not have permission to perform this action',
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        msg: 'User not found',
      });
    }

    user.status = false;
    await user.save();

    return res.status(200).json({
      msg: `User with ID ${id} deleted successfully`,
      user,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      msg: 'Try again',
    });
  }
};
