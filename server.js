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
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Node API app is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

const mqtt = require("mqtt");
const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(MONGO_URL);
let sensorsCollection;

async function initDb() {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("smart_farm");
    sensorsCollection = db.collection("sensors");
    console.log("MongoDB client ready for MQTT updates");
  } catch (err) {
    console.error("Failed to connect MongoDB for MQTT", err);
  }
}

initDb();

process.on("SIGINT", async () => {
  await mongoClient.close();
  process.exit(0);
});

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

client.on("connect", function () {
  console.log("mqtt client connected");
  for (let index = 0; index < topics.length; index++) {
    const topic = topics[index];
    client.subscribe(topic, function (err) {
      if (err) {
        console.log(err);
      }
    });
  }
});

client.on("message", async function (topic, message) {
  try {
    let payload = JSON.parse(message.toString());

    // console.log(payload)
    if (payload.device_id && payload.data) {
      let topics = topic.split("/");
      let deviceID = payload.device_id;
      let dataType = topics[2];
      let version = payload.version;

      if (payload.data) {
        for (let i = 0; i < payload.data.length; i++) {
          let dataPoint = payload.data[i];
          let id = dataPoint.id;

          let dataObject = {
            device_id: deviceID,
            sensor_type: dataType,
            sensor_id: id,
            version: version,
            value: dataPoint.value,
            last_updated: new Date(),
          };

          if (!sensorsCollection) {
            console.error("Sensors collection not initialized");
            return;
          }

          const filter = {
            device_id: deviceID,
            sensor_type: dataType,
            sensor_id: id,
          };
          const updateDoc = {
            $set: {
              version: version,
              // "value": dataPoint.value,
              last_updated: new Date(),
            },
          };

          const options = { upsert: true };
          await sensorsCollection.updateOne(filter, updateDoc, options);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
});
