const Joi = require('joi');

const getSensorDataSchema = Joi.object({
  device_id: Joi.string().required(),
  sensor: Joi.string().required(),
});

const getSensorDataRangeSchema = Joi.object({
  device_id: Joi.string().required(),
  sensor: Joi.string().required(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
});

const createSensorDataValueSchema = Joi.object({
  device_id: Joi.string().required(),
  dataset: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        sensor: Joi.string().required(),
        value: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
      })
    )
    .min(1)
    .required(),
});

const aggregateSensorDataSchema = Joi.object({
  device_id: Joi.string().required(),
  sensor: Joi.string().required(),
  sensor_id: Joi.string().optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  groupBy: Joi.string().valid('day', 'hour').default('hour'),
});

module.exports = {
  getSensorDataSchema,
  getSensorDataRangeSchema,
  createSensorDataValueSchema,
  aggregateSensorDataSchema,
};
