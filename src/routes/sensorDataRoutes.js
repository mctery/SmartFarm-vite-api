const express = require("express");
const {
  createSensorDataValue,
  getSensorData,
  getSensorDataRange,
} = require("../controllers/sensorDataController");
const { verifyToken } = require("../middleware/authorization");

const router = express.Router();

router.use(verifyToken);

router.route("/find").post(getSensorData);
router.route("/range").post(getSensorDataRange);
router.route("/create").post(createSensorDataValue);

module.exports = router;
