const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiry, bcryptRounds } = require('../config');

const getUsers = asyncHandler(async (req, res) => {
  console.log('getUsers called');
  const users = await User.find({ status: 'A' });
  res.json({ message: 'OK', data: users });
});

const getUser = asyncHandler(async (req, res) => {
  console.log('getUser called');
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error(`User not found: ${req.params.id}`);
  }
  res.json({ message: 'OK', data: user });
});

const login = asyncHandler(async (req, res) => {
  console.log('login called');
  const { email, password } = req.body;
  console.log(`Login attempt for user: ${email}`);

  const result = await User.find({ email });
  if (result.length === 0) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const passwordMatch = await bcrypt.compare(password, result[0].password);
  if (!passwordMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ user: result[0].email }, jwtSecret, { expiresIn: jwtExpiry });
  res.json({
    message: 'OK',
    token,
    data: {
      first_name: result[0].first_name,
      last_name: result[0].last_name,
      email: result[0].email,
      user_id: result[0].user_id,
    },
  });
});

const createUser = asyncHandler(async (req, res) => {
  console.log('createUser called');
  const info = req.body;
  console.log(`Registering user: ${info.email}`);

  const findUser = await User.find({ email: info.email });
  if (findUser.length > 0) {
    res.status(409);
    throw new Error('User already exists');
  }

  info.password = await bcrypt.hash(info.password, bcryptRounds);
  info.status = 'A';
  const user = await User.create(info);
  res.status(201).json({ message: 'OK', data: user });
});

const updateUser = asyncHandler(async (req, res) => {
  console.log('updateUser called');
  const { id } = req.params;
  const info = req.body;

  if (info.password) {
    info.password = await bcrypt.hash(info.password, bcryptRounds);
  }

  const updatedUser = await User.findByIdAndUpdate(id, info, { new: true });
  if (!updatedUser) {
    res.status(404);
    throw new Error(`User not found: ${id}`);
  }
  res.json({ message: 'OK', data: updatedUser });
});

const deleteUser = asyncHandler(async (req, res) => {
  console.log('deleteUser called');
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { status: 'D' });
  if (!user) {
    res.status(404);
    throw new Error(`User not found: ${id}`);
  }
  res.json({ message: 'OK', data: user });
});

module.exports = {
  login,
  createUser,
  updateUser,
  deleteUser,
  getUsers,
  getUser,
};
