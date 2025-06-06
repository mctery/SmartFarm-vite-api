import { inject } from "@vercel/analytics"
const express = require('express');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const mqtt = require('mqtt');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const sensorWidgetRoutes = require('./routes/sensorWidgetRoutes');
const sensorDataRoutes = require('./routes/sensorDataRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();
const { PORT, MONGO_URL, FRONTEND, MQTT_URL } = process.env;

app.use(cors({ origin: FRONTEND, optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use('/api/users', userRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/sensorWidget', sensorWidgetRoutes);
app.use('/api/sensorsdata', sensorDataRoutes);
app.use('/api/weather', weatherRoutes);

app.get('/', (req, res) => {
  res.send('Hello NODE API');
});
app.get('/blog', (req, res) => {
  res.send('Hello Blog, My name is Devtamin');
});

app.use(errorMiddleware);

// mongoose configuration
mongoose.set('strictQuery', false);

const mongoClient = new MongoClient(MONGO_URL);
let sensorsCollection;

async function connectDatabases() {
  await mongoose.connect(MONGO_URL);
  await mongoClient.connect();
  sensorsCollection = mongoClient.db('smart_farm').collection('sensors');
  console.log('Connected to MongoDB');
}

const mqttClient = mqtt.connect(MQTT_URL, {
  username: '',
  password: '',
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  will: {
    topic: 'device/will',
    payload: 'device disconnected',
    qos: 0,
    retain: false,
  },
});

const topics = [
  'device/+/temperature',
  'device/+/humidity',
  'device/+/light',
  'device/+/soil',
];

function setupMqtt() {
  mqttClient.on('connect', () => {
    console.log('mqtt client connected');
    for (const topic of topics) {
      mqttClient.subscribe(topic, err => err && console.log(err));
    }
  });

  mqttClient.on('message', async (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());
      if (!payload.device_id || !payload.data) return;

      const [, , dataType] = topic.split('/');
      const { device_id: deviceID, version } = payload;

      for (const dataPoint of payload.data) {
        const filter = {
          device_id: deviceID,
          sensor_type: dataType,
          sensor_id: dataPoint.id,
        };
        const updateDoc = {
          $set: {
            version,
            value: dataPoint.value,
            last_updated: new Date(),
          },
        };
        await sensorsCollection.updateOne(filter, updateDoc, { upsert: true });
      }
    } catch (err) {
      console.error(err);
    }
  });
}

async function start() {
  try {
    await connectDatabases();
    app.listen(PORT, () => {
      console.log(`Node API app is running on port ${PORT}`);
    });
    setupMqtt();
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

async function shutdown() {
  await mongoClient.close();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();
