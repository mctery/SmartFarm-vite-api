const express = require("express");
const mongoose = require("mongoose");

const UserRoute = require("./routes/userRoute");
const deviceRoute = require("./routes/device.Route");
const sensorRoute = require("./routes/sensor.Route");
const sensorWidget = require("./routes/sensorWidget.Route");
const sensorDataRoute = require("./routes/sensorData.Route");
const weather = require("./routes/weather.Route");

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

app.use("/api/users", UserRoute);
app.use("/api/devices", deviceRoute);
app.use("/api/sensors", sensorRoute);
app.use("/api/sensorWidget", sensorWidget);
app.use("/api/sensorsdata", sensorDataRoute);
app.use("/api/weather", weather);
// app.use('/api/devices', deviceRoute);

app.get("/", (req, res) => {
  res.send("Hello NODE API");
});

app.get("/blog", (req, res) => {
  res.send("Hello Blog, My name is Devtamin");
});

app.use(errorMiddleware);

mongoose.set("strictQuery", false);

const { MongoClient } = require("mongodb");
const mongoClient = new MongoClient(MONGO_URL);

async function startServer() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("connected to MongoDB");

    await mongoClient.connect();
    console.log("Mongo client connected");

    app.listen(PORT, () => {
      console.log(`Node API app is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

startServer();

const mqtt = require("mqtt");

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

          const dbName = "smart_farm";
          const database = mongoClient.db(dbName);
          const collectionName = `sensors`;
          const collection = database.collection(collectionName);

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
          await collection.updateOne(filter, updateDoc, options);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
});

process.on("SIGINT", async () => {
  try {
    await mongoClient.close();
    console.log("Mongo client disconnected");
  } finally {
    process.exit(0);
  }
});

process.on("SIGTERM", async () => {
  try {
    await mongoClient.close();
    console.log("Mongo client disconnected");
  } finally {
    process.exit(0);
  }
});