const DeviceLog = require('../models/deviceLogModel');
const asyncHandler = require('express-async-handler');
const logger = require('../config/logger');

const getDeviceLogs = asyncHandler(async (req, res) => {
  logger.debug('getDeviceLogs called');
  const { device_id } = req.params;
  const page = parseInt(req.query?.page) || null;
  const limit = parseInt(req.query?.limit) || 50;

  const filter = { device_id };
  if (req.query?.event) {
    filter.event = req.query.event;
  }

  if (page) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      DeviceLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      DeviceLog.countDocuments(filter),
    ]);
    return res.json({
      message: 'OK',
      data: logs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }

  const logs = await DeviceLog.find(filter).sort({ createdAt: -1 }).limit(limit);
  res.json({ message: 'OK', data: logs });
});

const getDeviceOnlineHistory = asyncHandler(async (req, res) => {
  logger.debug('getDeviceOnlineHistory called');
  const { device_id } = req.params;
  const logs = await DeviceLog.find({
    device_id,
    event: { $in: ['online', 'offline'] },
  })
    .sort({ createdAt: -1 })
    .limit(100);
  res.json({ message: 'OK', data: logs });
});

module.exports = {
  getDeviceLogs,
  getDeviceOnlineHistory,
};
