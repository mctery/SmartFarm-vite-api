require('dotenv').config();

/** Record status constants — single source of truth for soft-delete pattern */
const STATUS = { ACTIVE: 'A', DELETED: 'D' };

/** Sensor value range for MQTT validation */
const SENSOR_VALUE_RANGE = { min: -1000, max: 10000 };

/** Default query limits per resource */
const QUERY_LIMITS = {
  default: 20,
  auditLogs: 50,
  deviceLogs: 50,
  onlineHistory: 100,
  adminUsersMax: 100,
  adminDevicesMax: 100,
  adminSensorsMax: 100,
  adminNotificationsMax: 100,
  adminDeviceLogsMax: 100,
};

/** Weather cache cleanup interval (ms) */
const WEATHER_CACHE_CLEANUP_MS = 10 * 60 * 1000; // 10 minutes

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.TOKEN_KEY,
  jwtExpiry: process.env.JWT_EXPIRY || '12h',
  refreshSecret: process.env.REFRESH_TOKEN_KEY || (process.env.TOKEN_KEY + '_refresh'),
  refreshExpiry: process.env.REFRESH_EXPIRY || '7d',
  bcryptRounds: 10,
  mqttUrl: process.env.MQTT_URL,
  mqttUser: process.env.MQTT_USER || '',
  mqttPass: process.env.MQTT_PASS || '',
  mqttTopics: [
    'device/+/temperature',
    'device/+/humidity',
    'device/+/light',
    'device/+/soil',
    'device/+/checkin',
    'device/+/will',
  ],
  resendApiKey: process.env.RESEND_API_KEY,
  resendFrom: process.env.RESEND_FROM || 'SmartFarm <onboarding@resend.dev>',
  appUrl: process.env.APP_URL || 'http://localhost:5173',
  resetTokenExpiryMs: 60 * 60 * 1000, // 1 hour
  corsOrigin: process.env.FRONTEND,
  bodyLimit: '10mb',
  sensorDataTTL: 90 * 24 * 60 * 60, // 90 days in seconds
  weatherCacheTTL: 3600, // 1 hour in seconds
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100,
  authRateLimitMax: 10,
  STATUS,
  SENSOR_VALUE_RANGE,
  QUERY_LIMITS,
  WEATHER_CACHE_CLEANUP_MS,
};

// Startup warnings for missing config
if (!process.env.RESEND_API_KEY) {
  console.warn(
    '[WARN] RESEND_API_KEY is not set — password reset emails will not be sent. ' +
    'Set RESEND_API_KEY in .env for production.'
  );
}

if (!process.env.REFRESH_TOKEN_KEY) {
  console.warn(
    '[WARN] REFRESH_TOKEN_KEY is not set — using TOKEN_KEY + "_refresh" as fallback. ' +
    'Set a dedicated REFRESH_TOKEN_KEY in .env for production.'
  );
}
