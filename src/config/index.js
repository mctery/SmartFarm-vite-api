require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.TOKEN_KEY,
  jwtExpiry: process.env.JWT_EXPIRY || '12h',
  bcryptRounds: 10,
  mqttUrl: process.env.MQTT_URL,
  mqttTopics: [
    'device/+/temperature',
    'device/+/humidity',
    'device/+/light',
    'device/+/soil',
  ],
  corsOrigin: process.env.FRONTEND,
  bodyLimit: '10mb',
  sensorDataTTL: 90 * 24 * 60 * 60, // 90 days in seconds
  weatherCacheTTL: 3600, // 1 hour in seconds
  socketPort: process.env.SOCKET_PORT || 3200,
};
