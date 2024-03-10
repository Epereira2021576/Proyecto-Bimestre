import User from '../users/user.model.js';

export const existingEmail = async (email = '') => {
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new Error(`The email ${email} has already been registered`);
  }
};

export const existingUserById = async (uid = '') => {
  const existingUser = await User.findOne({ _id: uid });
  if (!existingUser) {
    throw new Error(`The user with the id ${uid} does not exist`);
  }
};

export const isValidRole = async (role = '') => {
  const existingRole = await User.findOne({ role });

  if (!existingRole) {
    throw new Error(`The role ${role} does not exist in the database.`);
  }
};
