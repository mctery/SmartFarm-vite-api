const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const logger = require('./config/logger');
const requestLogger = require('./middleware/requestLogger');
const { createMqttClient, subscribeSensorTopics } = require('./config/mqtt');
const { handleSensorMessage, handleDeviceCheckin, handleDeviceWill } = require('./services/mqttHandler');
const { setCommandClient } = require('./controllers/deviceController');
const { initSocketIO } = require('./config/socketio');
const errorMiddleware = require('./middleware/errorMiddleware');

// Routes
const userRoutes = require('./routes/userRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const sensorWidgetRoutes = require('./routes/sensorWidgetRoutes');
const sensorDataRoutes = require('./routes/sensorDataRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const menuRoutes = require('./routes/menuRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const sensorThresholdRoutes = require('./routes/sensorThresholdRoutes');
const deviceLogRoutes = require('./routes/deviceLogRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');
const userSettingRoutes = require('./routes/userSettingRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Security headers
app.use(helmet());

// Middleware
app.use(cors({ origin: config.corsOrigin, optionsSuccessStatus: 200 }));

// Global rate limit
const globalLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'ERROR', data: 'Too many requests, please try again later' },
});
app.use(globalLimiter);

app.use(express.json({ limit: config.bodyLimit }));
app.use(express.urlencoded({ limit: config.bodyLimit, extended: true }));
app.use(requestLogger);

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/sensorWidget', sensorWidgetRoutes);
app.use('/api/sensorsdata', sensorDataRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/thresholds', sensorThresholdRoutes);
app.use('/api/device-logs', deviceLogRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/settings', userSettingRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler (must be last)
app.use(errorMiddleware);

// Database
mongoose.set('strictQuery', false);

async function connectDatabase() {
  logger.info('Connecting to MongoDB...');
  await mongoose.connect(config.mongoUrl);
  logger.info('Connected to MongoDB');
}

// MQTT
function setupMqtt() {
  logger.info('Setting up MQTT...');
  const mqttClient = createMqttClient();
  setCommandClient(mqttClient);

  mqttClient.on('connect', () => {
    logger.info('MQTT client connected');
    subscribeSensorTopics(mqttClient);
  });

  mqttClient.on('message', (topic, message) => {
    const parts = topic.split('/');
    const msgType = parts[2]; // device/{id}/{type}
    if (msgType === 'checkin') {
      handleDeviceCheckin(topic, message);
    } else if (msgType === 'will') {
      handleDeviceWill(topic, message);
    } else {
      handleSensorMessage(topic, message);
    }
  });

  mqttClient.on('error', (err) => {
    logger.error('MQTT error in app', { error: err.message });
  });

  return mqttClient;
}

// Startup
let server;

async function start() {
  try {
    await connectDatabase();
    server = http.createServer(app);
    initSocketIO(server);
    server.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} (HTTP + Socket.IO)`);
    });
    setupMqtt();
  } catch (err) {
    logger.error('Failed to start server', { error: err.message });
    process.exit(1);
  }
}

async function shutdown() {
  logger.info('Shutting down...');
  if (server) server.close();
  await mongoose.disconnect();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();
