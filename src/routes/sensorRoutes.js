const express = require("express");
const {
  getSensors,
  getSensor,
  getDeviceSensor,
  getDeviceSensorById,
  createSensor,
  updateSensor,
  deleteSensor,
} = require("../controllers/sensorController");
const { verifyToken } = require("../middleware/authorization");

const router = express.Router();

router.use(verifyToken);
router.get("/device/type/:id/:type", getDeviceSensor);
router.get("/device/:id", getDeviceSensorById);

router.route("/").get(getSensors).post(createSensor);

router.route("/:id").get(getSensor).put(updateSensor).delete(deleteSensor);

module.exports = router;
