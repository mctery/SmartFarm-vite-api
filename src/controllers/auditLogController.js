const AuditLog = require('../models/auditLogModel');
const asyncHandler = require('express-async-handler');
const logger = require('../config/logger');

const getAuditLogs = asyncHandler(async (req, res) => {
  logger.debug('getAuditLogs called');
  const page = parseInt(req.query?.page) || 1;
  const limit = parseInt(req.query?.limit) || 50;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query?.user_id) filter.user_id = req.query.user_id;
  if (req.query?.resource_type) filter.resource_type = req.query.resource_type;
  if (req.query?.action) filter.action = req.query.action;

  const [logs, total] = await Promise.all([
    AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    AuditLog.countDocuments(filter),
  ]);

  res.json({
    message: 'OK',
    data: logs,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

const getAuditLogsByResource = asyncHandler(async (req, res) => {
  logger.debug('getAuditLogsByResource called');
  const { resource_type, resource_id } = req.params;
  const logs = await AuditLog.find({ resource_type, resource_id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json({ message: 'OK', data: logs });
});

module.exports = {
  getAuditLogs,
  getAuditLogsByResource,
};
