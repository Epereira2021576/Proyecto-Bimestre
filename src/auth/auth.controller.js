import { request, response } from 'express';
import bcryptjs from 'bcryptjs';
import User from '../users/user.model.js';
import { generateJWT } from '../helpers/generate-jwt.js';

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  await user.save();
  res.status(200).json({ user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Email not found' });

    if (!user.status) return res.status(400).json({ msg: 'User not found' });

    const validPass = bcryptjs.compareSync(password, user.password);
    if (!validPass)
      return res.status(400).json({ msg: 'Password is incorrect' });

    const token = generateJWT(user.id);
    res.status(200).json({ msg: 'Logged in!', user, token });
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
};
