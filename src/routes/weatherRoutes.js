const express = require('express');
const { getWeatherNow, getWeatherNowAll } = require('../controllers/weatherController');

const router = express.Router();

router.route('/').get(getWeatherNowAll);
router.route('/:city').get(getWeatherNow);

module.exports = router;
