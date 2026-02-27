/**
 * Permission constants for RBAC system.
 *
 * Format: 'module:action'
 * Admin users bypass all permission checks.
 */

const PERMISSIONS = {
  // Dashboard
  DASHBOARD_READ: 'dashboard:read',

  // Devices
  DEVICES_READ: 'devices:read',
  DEVICES_WRITE: 'devices:write',
  DEVICES_DELETE: 'devices:delete',
  DEVICES_COMMAND: 'devices:command',

  // Sensors
  SENSORS_READ: 'sensors:read',
  SENSORS_WRITE: 'sensors:write',
  SENSORS_DELETE: 'sensors:delete',

  // Sensor Data
  SENSOR_DATA_READ: 'sensor_data:read',
  SENSOR_DATA_WRITE: 'sensor_data:write',

  // Widgets
  WIDGETS_READ: 'widgets:read',
  WIDGETS_WRITE: 'widgets:write',
  WIDGETS_DELETE: 'widgets:delete',

  // Thresholds
  THRESHOLDS_READ: 'thresholds:read',
  THRESHOLDS_WRITE: 'thresholds:write',
  THRESHOLDS_DELETE: 'thresholds:delete',

  // Notifications
  NOTIFICATIONS_READ: 'notifications:read',
  NOTIFICATIONS_WRITE: 'notifications:write',

  // Weather
  WEATHER_READ: 'weather:read',

  // Device Logs
  DEVICE_LOGS_READ: 'device_logs:read',

  // Audit Logs
  AUDIT_LOGS_READ: 'audit_logs:read',

  // Menus
  MENUS_READ: 'menus:read',
  MENUS_WRITE: 'menus:write',
  MENUS_DELETE: 'menus:delete',

  // User Management
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',
  USERS_DELETE: 'users:delete',

  // Settings
  SETTINGS_READ: 'settings:read',
  SETTINGS_WRITE: 'settings:write',

  // Admin Panel
  ADMIN_ACCESS: 'admin:access',
};

/** Default permissions granted to newly registered users */
const DEFAULT_USER_PERMISSIONS = [
  PERMISSIONS.DASHBOARD_READ,
  PERMISSIONS.DEVICES_READ,
  PERMISSIONS.DEVICES_WRITE,
  PERMISSIONS.DEVICES_COMMAND,
  PERMISSIONS.SENSORS_READ,
  PERMISSIONS.SENSORS_WRITE,
  PERMISSIONS.SENSOR_DATA_READ,
  PERMISSIONS.WIDGETS_READ,
  PERMISSIONS.WIDGETS_WRITE,
  PERMISSIONS.THRESHOLDS_READ,
  PERMISSIONS.THRESHOLDS_WRITE,
  PERMISSIONS.NOTIFICATIONS_READ,
  PERMISSIONS.NOTIFICATIONS_WRITE,
  PERMISSIONS.WEATHER_READ,
  PERMISSIONS.DEVICE_LOGS_READ,
  PERMISSIONS.MENUS_READ,
  PERMISSIONS.SETTINGS_READ,
  PERMISSIONS.SETTINGS_WRITE,
];

/** Permission groups for Admin Panel UI */
const PERMISSION_GROUPS = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    permissions: [PERMISSIONS.DASHBOARD_READ],
  },
  {
    key: 'devices',
    label: 'Devices',
    permissions: [
      PERMISSIONS.DEVICES_READ,
      PERMISSIONS.DEVICES_WRITE,
      PERMISSIONS.DEVICES_DELETE,
      PERMISSIONS.DEVICES_COMMAND,
    ],
  },
  {
    key: 'sensors',
    label: 'Sensors',
    permissions: [
      PERMISSIONS.SENSORS_READ,
      PERMISSIONS.SENSORS_WRITE,
      PERMISSIONS.SENSORS_DELETE,
    ],
  },
  {
    key: 'sensor_data',
    label: 'Sensor Data',
    permissions: [PERMISSIONS.SENSOR_DATA_READ, PERMISSIONS.SENSOR_DATA_WRITE],
  },
  {
    key: 'widgets',
    label: 'Widgets',
    permissions: [
      PERMISSIONS.WIDGETS_READ,
      PERMISSIONS.WIDGETS_WRITE,
      PERMISSIONS.WIDGETS_DELETE,
    ],
  },
  {
    key: 'thresholds',
    label: 'Thresholds',
    permissions: [
      PERMISSIONS.THRESHOLDS_READ,
      PERMISSIONS.THRESHOLDS_WRITE,
      PERMISSIONS.THRESHOLDS_DELETE,
    ],
  },
  {
    key: 'notifications',
    label: 'Notifications',
    permissions: [PERMISSIONS.NOTIFICATIONS_READ, PERMISSIONS.NOTIFICATIONS_WRITE],
  },
  {
    key: 'weather',
    label: 'Weather',
    permissions: [PERMISSIONS.WEATHER_READ],
  },
  {
    key: 'device_logs',
    label: 'Device Logs',
    permissions: [PERMISSIONS.DEVICE_LOGS_READ],
  },
  {
    key: 'audit_logs',
    label: 'Audit Logs',
    permissions: [PERMISSIONS.AUDIT_LOGS_READ],
  },
  {
    key: 'menus',
    label: 'Menus',
    permissions: [
      PERMISSIONS.MENUS_READ,
      PERMISSIONS.MENUS_WRITE,
      PERMISSIONS.MENUS_DELETE,
    ],
  },
  {
    key: 'users',
    label: 'User Management',
    permissions: [
      PERMISSIONS.USERS_READ,
      PERMISSIONS.USERS_WRITE,
      PERMISSIONS.USERS_DELETE,
    ],
  },
  {
    key: 'settings',
    label: 'Settings',
    permissions: [PERMISSIONS.SETTINGS_READ, PERMISSIONS.SETTINGS_WRITE],
  },
  {
    key: 'admin',
    label: 'Admin Panel',
    permissions: [PERMISSIONS.ADMIN_ACCESS],
  },
];

module.exports = { PERMISSIONS, DEFAULT_USER_PERMISSIONS, PERMISSION_GROUPS };
