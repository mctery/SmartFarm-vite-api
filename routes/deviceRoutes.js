const express = require("express");
const {
  getDevices,
  getDevice,
  getDeviceUser,
  createDevice,
  updateDevice,
  deleteDevice,
} = require("../controllers/deviceController");
const { verifyToken } = require("../middleware/authorization");

const router = express.Router();

router.use(verifyToken);

router
  .route("/")
  .get(getDevices)
  .post(createDevice);

router.get("/user/:user_id", getDeviceUser);

router
  .route("/:id")
  .get(getDevice)
  .put(updateDevice)
  .delete(deleteDevice);

module.exports = router;
