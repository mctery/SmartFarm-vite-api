const express = require("express");
const Device = require("../models/deviceModel");
const {
  getDevices,
  getDevice,
  getDeviceUser,
  createDevice,
  updateDevice,
  deleteDevice,
} = require("../controllers/deviceController");
const { userCheckToken, verifyToken } = require("../middleware/authorization");

const router = express.Router();

//Verify
router.use((req, res, next) => {
  // const pathname = req.path
  // console.log(pathname)
  // if(pathname == '/login' || pathname == '/register' || pathname == '/token') {
  //     return next()
  // }
  verifyToken(req, res, next);
});

router.get("/", getDevices);

router.get("/:id", getDevice);

router.get("/user/:user_id", getDeviceUser);

router.post("/", createDevice);
// update a product
router.put("/:id", updateDevice);
// delete a product
router.delete("/:id", deleteDevice);

module.exports = router;
