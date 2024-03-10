import { request, response } from 'express';
import bcryptjs from 'bcryptjs';
import User from './user.model.js';
import jwt from 'jsonwebtoken';

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

export const deleteUserAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const secretword = process.env.JWT_SECRET;
    let xtoken = req.headers.xtoken;
    const { uid } = jwt.verify(xtoken, secretword);

    if (uid != id) {
      res.status(401).json({
        msg: 'You can only delete your own account',
      });
    }
    const user = await User.findById(id);

    if (!user.role === 'ADMIN_ROLE') {
      return res.status(403).json({
        msg: 'You do not have permission to perform this action',
      });
    }

    if (!user) {
      return res.status(400).json({
        msg: 'User not found',
      });
    }
    // Check the password
    const validPass = bcryptjs.compareSync(password, user.password);
    if (!validPass) {
      return res.status(400).json({
        msg: 'Incorrect password',
      });
    }

    const userGone = await User.findByIdAndDelete(id);
    if (!userGone) {
      return res.status(400).json({
        msg: 'User not found',
      });
    }

    return res.status(200).json({
      msg: `User with ID ${id} deleted successfully`,
      user,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      msg: 'Try again',
    });
  }
};

export const deleteUserClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, confirmation } = req.body;
    const secretword = process.env.JWT_SECRET;
    let xtoken = req.headers.xtoken;
    const { uid } = jwt.verify(xtoken, secretword);

    if (uid != id) {
      res.status(401).json({
        msg: 'You can only delete your own account',
      });
    }
    const user = await User.findById(id);

    if (user.role === 'ADMIN_ROLE') {
      return res.status(403).json({
        msg: 'You cannot delete an admin profile',
      });
    }

    if (!user) {
      return res.status(400).json({
        msg: 'User not found',
      });
    }
    // Check the password
    const validPass = bcryptjs.compareSync(password, user.password);
    if (!validPass) {
      return res.status(400).json({
        msg: 'Incorrect password',
      });
    }

    if (confirmation !== 'DELETE') {
      return res.status(400).json({
        msg: 'You must confirm the action by typing DELETE',
      });
    }

    const userGone = await User.findByIdAndDelete(id);
    if (!userGone) {
      return res.status(400).json({
        msg: 'User not found',
      });
    }

    return res.status(200).json({
      msg: `User with ID ${id} deleted successfully`,
      user,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      msg: 'Try again',
    });
  }
};
