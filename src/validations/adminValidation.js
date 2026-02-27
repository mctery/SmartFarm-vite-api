const Joi = require('joi');
const { PERMISSIONS } = require('../config/permissions');

const allPermissionValues = Object.values(PERMISSIONS);

const updateRoleSchema = Joi.object({
  role: Joi.string().valid('admin', 'user').required(),
});

const updatePermissionsSchema = Joi.object({
  permissions: Joi.array()
    .items(Joi.string().valid('*', ...allPermissionValues))
    .required(),
});

const updateUserMenusSchema = Joi.object({
  menu_ids: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .required(),
});

module.exports = { updateRoleSchema, updatePermissionsSchema, updateUserMenusSchema };
