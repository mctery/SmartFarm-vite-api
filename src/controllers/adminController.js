const User = require('../models/userModel');
const Permission = require('../models/permissionModel');
const Menu = require('../models/menuModel');
const UserMenu = require('../models/userMenuModel');
const asyncHandler = require('express-async-handler');
const { PERMISSION_GROUPS, DEFAULT_USER_PERMISSIONS } = require('../config/permissions');
const getUserId = require('../utils/getUserId');
const logger = require('../config/logger');

const getAdminUsers = asyncHandler(async (req, res) => {
  logger.debug('getAdminUsers called');
  const { search, page = 1, limit = 20 } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

  const filter = { status: 'A' };
  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ first_name: regex }, { last_name: regex }, { email: regex }];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    User.countDocuments(filter),
  ]);

  res.json({
    message: 'OK',
    data: users,
    pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
  });
});

const getAdminUser = asyncHandler(async (req, res) => {
  logger.debug('getAdminUser called');
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error(`User not found: ${req.params.id}`);
  }

  const userId = getUserId(user);
  const permDoc = await Permission.findOne({ user_id: userId });
  const permissions = permDoc ? permDoc.permissions : [];

  res.json({ message: 'OK', data: { ...user.toObject(), permissions } });
});

const updateUserRole = asyncHandler(async (req, res) => {
  logger.debug('updateUserRole called');
  const { id } = req.params;
  const { role } = req.body;

  const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
  if (!user) {
    res.status(404);
    throw new Error(`User not found: ${id}`);
  }

  // If promoted to admin, set wildcard permissions
  if (role === 'admin') {
    const userId = getUserId(user);
    await Permission.findOneAndUpdate(
      { user_id: userId },
      { permissions: ['*'] },
      { upsert: true, new: true }
    );
  }

  res.json({ message: 'OK', data: user });
});

const getUserPermissions = asyncHandler(async (req, res) => {
  logger.debug('getUserPermissions called');
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error(`User not found: ${req.params.id}`);
  }

  const userId = getUserId(user);
  const permDoc = await Permission.findOne({ user_id: userId });
  const permissions = permDoc ? permDoc.permissions : DEFAULT_USER_PERMISSIONS;

  res.json({ message: 'OK', data: { user_id: userId, permissions } });
});

const updateUserPermissions = asyncHandler(async (req, res) => {
  logger.debug('updateUserPermissions called');
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error(`User not found: ${req.params.id}`);
  }

  const userId = getUserId(user);
  const { permissions } = req.body;

  const permDoc = await Permission.findOneAndUpdate(
    { user_id: userId },
    { permissions },
    { upsert: true, new: true }
  );

  res.json({ message: 'OK', data: { user_id: userId, permissions: permDoc.permissions } });
});

const getPermissionDefinitions = asyncHandler(async (req, res) => {
  logger.debug('getPermissionDefinitions called');
  res.json({ message: 'OK', data: PERMISSION_GROUPS });
});

const getAdminMenus = asyncHandler(async (req, res) => {
  logger.debug('getAdminMenus called');
  const menus = await Menu.find({ status: 'A' }).sort({ order: 1 });
  res.json({ message: 'OK', data: menus });
});

const getUserMenus = asyncHandler(async (req, res) => {
  logger.debug('getUserMenus called');
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error(`User not found: ${req.params.id}`);
  }

  const userId = getUserId(user);
  const userMenu = await UserMenu.findOne({ user_id: userId });
  const menu_ids = userMenu ? userMenu.menu_ids : [];

  res.json({ message: 'OK', data: { user_id: userId, menu_ids } });
});

const updateUserMenus = asyncHandler(async (req, res) => {
  logger.debug('updateUserMenus called');
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error(`User not found: ${req.params.id}`);
  }

  const userId = getUserId(user);
  const { menu_ids } = req.body;

  if (menu_ids.length > 0) {
    const existingCount = await Menu.countDocuments({ _id: { $in: menu_ids }, status: 'A' });
    if (existingCount !== menu_ids.length) {
      res.status(400);
      throw new Error('One or more menu_ids are invalid or refer to inactive menus');
    }
  }

  const userMenu = await UserMenu.findOneAndUpdate(
    { user_id: userId },
    { menu_ids },
    { upsert: true, new: true }
  );

  res.json({ message: 'OK', data: { user_id: userId, menu_ids: userMenu.menu_ids } });
});

module.exports = {
  getAdminUsers,
  getAdminUser,
  updateUserRole,
  getUserPermissions,
  updateUserPermissions,
  getPermissionDefinitions,
  getAdminMenus,
  getUserMenus,
  updateUserMenus,
};
