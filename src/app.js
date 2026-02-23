const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');
const { createMqttClient, subscribeSensorTopics } = require('./config/mqtt');
const { handleSensorMessage } = require('./services/mqttHandler');
const { setCommandClient } = require('./controllers/deviceController');
const errorMiddleware = require('./middleware/errorMiddleware');

// Routes
const userRoutes = require('./routes/userRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const sensorWidgetRoutes = require('./routes/sensorWidgetRoutes');
const sensorDataRoutes = require('./routes/sensorDataRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const menuRoutes = require('./routes/menuRoutes');

const app = express();

// Middleware
app.use(cors({ origin: config.corsOrigin, optionsSuccessStatus: 200 }));
app.use(express.json({ limit: config.bodyLimit }));
app.use(express.urlencoded({ limit: config.bodyLimit, extended: true }));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/sensorWidget', sensorWidgetRoutes);
app.use('/api/sensorsdata', sensorDataRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/menus', menuRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler (must be last)
app.use(errorMiddleware);

// Database
mongoose.set('strictQuery', false);

async function connectDatabase() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(config.mongoUrl);
  console.log('Connected to MongoDB');
}

// MQTT
function setupMqtt() {
  console.log('Setting up MQTT...');
  const mqttClient = createMqttClient();
  setCommandClient(mqttClient);

  mqttClient.on('connect', () => {
    console.log('MQTT client connected');
    subscribeSensorTopics(mqttClient);
  });

  mqttClient.on('message', handleSensorMessage);
  return mqttClient;
}

// Startup
async function start() {
  try {
    await connectDatabase();
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
    setupMqtt();
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

async function shutdown() {
  console.log('Shutting down...');
  await mongoose.disconnect();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();
