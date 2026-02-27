require('dotenv').config();

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
  mqttTopics: [
    'device/+/temperature',
    'device/+/humidity',
    'device/+/light',
    'device/+/soil',
    'device/+/checkin',
    'device/+/will',
  ],
  corsOrigin: process.env.FRONTEND,
  bodyLimit: '10mb',
  sensorDataTTL: 90 * 24 * 60 * 60, // 90 days in seconds
  weatherCacheTTL: 3600, // 1 hour in seconds
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100,
  authRateLimitMax: 10,
};
