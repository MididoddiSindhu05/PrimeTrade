const { User } = require('../models');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'createdAt'] });
    res.json(users);
  } catch (error) {
    next(error);
  }
};
