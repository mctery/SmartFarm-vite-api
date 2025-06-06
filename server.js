const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const sensorWidgetRoutes = require("./routes/sensorWidgetRoutes");
const sensorDataRoutes = require("./routes/sensorDataRoutes");
const weatherRoutes = require("./routes/weatherRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");

let cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const FRONTEND = process.env.FRONTEND;
const MQTT_URL = process.env.MQTT_URL;

let corsOptions = {
  origin: FRONTEND,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes

app.use("/api/users", userRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/sensorWidget", sensorWidgetRoutes);
app.use("/api/sensorsdata", sensorDataRoutes);
app.use("/api/weather", weatherRoutes);
// app.use('/api/devices', deviceRoute);

app.get("/", (req, res) => {
  res.send("Hello NODE API");
});

app.get("/blog", (req, res) => {
  res.send("Hello Blog, My name is Devtamin");
});

app.use(errorMiddleware);

mongoose.set("strictQuery", false);

async function startServer() {
  try {
    await mongoose.connect(MONGO_URL);

    await mongoClient.connect();
    const db = mongoClient.db("smart_farm");
    sensorsCollection = db.collection("sensors");
    console.log("connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Node API app is running on port ${PORT}`);
    });

    setupMqtt();
  } catch (error) {
    console.log(error);
  }
}

const mqtt = require("mqtt");
const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(MONGO_URL);
let sensorsCollection;

process.on("SIGINT", async () => {
  await mongoClient.close();
  process.exit(0);
});

function setupMqtt() {
  const client = mqtt.connect(MQTT_URL, {
    username: "",
    password: "",
    clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
    will: {
      topic: "device/will",
      payload: "device disconnected",
      qos: 0,
      retain: false,
    },
  });

  const topics = [
    "device/+/temperature",
    "device/+/humidity",
    "device/+/light",
    "device/+/soil",
  ];

  client.on("connect", () => {
    console.log("mqtt client connected");
    client.subscribe(topics, (err) => {
      if (err) console.error(err);
    });
  });

  client.on("message", handleMessage);
}

async function handleMessage(topic, message) {
  try {
    const payload = JSON.parse(message.toString());
    if (!payload.device_id || !Array.isArray(payload.data)) return;

    const [, , dataType] = topic.split("/");
    const deviceID = payload.device_id;
    const version = payload.version;

    if (!sensorsCollection) {
      console.error("Sensors collection not initialized");
      return;
    }

    await Promise.all(
      payload.data.map((dataPoint) => {
        const filter = {
          device_id: deviceID,
          sensor_type: dataType,
          sensor_id: dataPoint.id,
        };
        const updateDoc = {
          $set: { version, last_updated: new Date() },
        };
        return sensorsCollection.updateOne(filter, updateDoc, { upsert: true });
      })
    );
  } catch (error) {
    console.error(error);
  }
}

startServer();
