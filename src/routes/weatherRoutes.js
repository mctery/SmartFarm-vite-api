const express = require("express");
const {
  getWeatherNow,
  getWeatherNowAll,
} = require("../controllers/weatherController");
const { verifyToken } = require("../middleware/authorization");

const router = express.Router();

router.use(verifyToken);

router.route("/").get(getWeatherNowAll);
router.route("/:city").get(getWeatherNow);

module.exports = router;
