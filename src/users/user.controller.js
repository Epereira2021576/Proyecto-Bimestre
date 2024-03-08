import { request, response } from 'express';
import bcryptjs from 'bcryptjs';
import User from './user.model.js';

//Method to post users
export const userPost = async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  await user.save();
  res.status(200).json({ user });
};

//Method to get users
export const userGet = async (req, res) => {
  const { limit, from } = req.query;
  const query = { status: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.status(200).json({ total, users });
};

//Method to update users
