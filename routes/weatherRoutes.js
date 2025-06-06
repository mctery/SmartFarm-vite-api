const express = require('express');
const { getWeatherNow, getWeatherNowAll } = require('../controllers/weatherController')
const router = express.Router();

router.get('/', getWeatherNowAll)
router.get('/:city', getWeatherNow)

module.exports = router;
