const Notification = require('../models/notificationModel');
const asyncHandler = require('express-async-handler');
const logger = require('../config/logger');

const getNotifications = asyncHandler(async (req, res) => {
  logger.debug('getNotifications called');
  const { user_id } = req.params;
  const page = parseInt(req.query?.page) || null;
  const limit = parseInt(req.query?.limit) || 20;

  const filter = { user_id };
  if (req.query?.is_read !== undefined) {
    filter.is_read = req.query.is_read === 'true';
  }

  if (page) {
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments(filter),
    ]);
    return res.json({
      message: 'OK',
      data: notifications,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }

  const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(limit);
  res.json({ message: 'OK', data: notifications });
});

const getUnreadCount = asyncHandler(async (req, res) => {
  logger.debug('getUnreadCount called');
  const { user_id } = req.params;
  const count = await Notification.countDocuments({ user_id, is_read: false });
  res.json({ message: 'OK', data: { count } });
});

const markAsRead = asyncHandler(async (req, res) => {
  logger.debug('markAsRead called');
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { is_read: true, read_at: new Date() },
    { new: true }
  );
  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }
  res.json({ message: 'OK', data: notification });
});

const markAllAsRead = asyncHandler(async (req, res) => {
  logger.debug('markAllAsRead called');
  const { user_id } = req.params;
  await Notification.updateMany(
    { user_id, is_read: false },
    { is_read: true, read_at: new Date() }
  );
  res.json({ message: 'OK', data: 'All notifications marked as read' });
});

const deleteNotification = asyncHandler(async (req, res) => {
  logger.debug('deleteNotification called');
  const notification = await Notification.findByIdAndDelete(req.params.id);
  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }
  res.json({ message: 'OK', data: notification });
});

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
