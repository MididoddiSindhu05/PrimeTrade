const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const createToken = (user) => {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const role = req.body.role === 'admin' ? 'admin' : 'user';
    const user = await User.create({ name, email, password: hashedPassword, role });

    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || user.role !== role) {
      return res.status(401).json({ message: 'Invalid credentials or role mismatch' });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(401).json({ message: 'Invalid credentials or role mismatch' });
    }

    const token = createToken(user);
    res.json({ token, expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
  } catch (error) {
    next(error);
  }
};
