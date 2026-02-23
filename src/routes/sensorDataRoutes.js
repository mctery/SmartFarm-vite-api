const express = require("express");
const {
  createSensorDataValue,
  getSensorData,
  getSensorDataRange,
  getAggregateSensorData,
} = require("../controllers/sensorDataController");
const { verifyToken } = require("../middleware/authorization");

const router = express.Router();

router.use(verifyToken);

router.route("/find").post(getSensorData);
router.route("/range").post(getSensorDataRange);
router.route("/create").post(createSensorDataValue);
router.route("/aggregate").post(getAggregateSensorData);

module.exports = router;
