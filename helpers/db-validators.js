const User = require('../models/user');
const Role = require('../models/role');

const existingEmail = async (email = '') => {
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new Error(`The email ${email} has already been registered`);
  }
};

const existingUserById = async (id = '') => {
  const existingUser = await User.findOne({ _id: id });
  if (!existingUser) {
    throw new Error(`The user with the ${id} does not exist`);
  }
};

const isValidRole = async (role = '') => {
  const existingRole = await Role.findOne({ role });

  if (!existingRole) {
    throw new Error(`The role ${role} does not exist in the database.`);
  }
};

module.exports = {
  existingEmail,
  existingUserById,
  isValidRole,
};
