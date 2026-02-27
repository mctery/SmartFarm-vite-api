const Joi = require('joi');

const createThresholdSchema = Joi.object({
  sensor_id: Joi.string().required(),
  device_id: Joi.string().required(),
  user_id: Joi.string().required(),
  min_value: Joi.number().allow(null).optional(),
  max_value: Joi.number().allow(null).optional(),
  is_active: Joi.boolean().optional(),
  notify_type: Joi.string().valid('in_app', 'push', 'both').optional(),
});

const updateThresholdSchema = Joi.object({
  min_value: Joi.number().allow(null).optional(),
  max_value: Joi.number().allow(null).optional(),
  is_active: Joi.boolean().optional(),
  notify_type: Joi.string().valid('in_app', 'push', 'both').optional(),
}).min(1);

module.exports = { createThresholdSchema, updateThresholdSchema };
