const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Register a new customer
 */
const registerCustomer = async ({ name, email, phone, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already registered');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role: 'customer',
    isVerified: true,
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };
};

/**
 * Register a new admin (Business Partner)
 */
const registerAdmin = async ({ name, email, phone, password, accessCode, address, dateOfBirth }) => {
  if (accessCode !== process.env.ADMIN_ACCESS_CODE) {
    throw new Error('Invalid admin access code');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already registered');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role: 'admin',
    address,
    dateOfBirth,
    isVerified: true,
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };
};

/**
 * Login user
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profilePicture: user.profilePicture,
    token: generateToken(user._id),
  };
};

module.exports = { registerCustomer, registerAdmin, loginUser };
