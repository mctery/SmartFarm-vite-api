const express = require('express');
const { verifyToken } = require('../middleware/authorization');
const { requireAdmin } = require('../middleware/checkPermission');
const validate = require('../middleware/validate');
const { updateRoleSchema, updatePermissionsSchema, updateUserMenusSchema } = require('../validations/adminValidation');
const {
  getAdminUsers,
  getAdminUser,
  updateUserRole,
  getUserPermissions,
  updateUserPermissions,
  getPermissionDefinitions,
  getAdminMenus,
  getUserMenus,
  updateUserMenus,
} = require('../controllers/adminController');

const router = express.Router();

// All admin routes require authentication + admin role
router.use(verifyToken);
router.use(requireAdmin);

router.get('/users', getAdminUsers);
router.get('/users/:id', getAdminUser);
router.put('/users/:id/role', validate(updateRoleSchema), updateUserRole);
router.get('/users/:id/permissions', getUserPermissions);
router.put('/users/:id/permissions', validate(updatePermissionsSchema), updateUserPermissions);
router.get('/users/:id/menus', getUserMenus);
router.put('/users/:id/menus', validate(updateUserMenusSchema), updateUserMenus);
router.get('/permissions', getPermissionDefinitions);
router.get('/menus', getAdminMenus);

module.exports = router;
