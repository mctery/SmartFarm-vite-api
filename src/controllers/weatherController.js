const axios = require('axios').default;
const asyncHandler = require('express-async-handler');
const { weatherCacheTTL } = require('../config');
const logger = require('../config/logger');

const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = process.env.OPEN_WEATHER_KEY;
const weatherCache = {};

// Clean expired cache entries periodically (every 10 minutes)
setInterval(() => {
  const now = Math.floor(Date.now() / 1000);
  for (const key of Object.keys(weatherCache)) {
    if (weatherCache[key].expire < now) {
      delete weatherCache[key];
    }
  }
}, 10 * 60 * 1000);

const getWeatherNow = asyncHandler(async (req, res) => {
  logger.debug('getWeatherNow called');
  const cityName = req.params.city;

  // Check cache and expiry
  const cached = weatherCache[cityName];
  const now = Math.floor(Date.now() / 1000);
  if (cached && now < cached.expire) {
    return res.json({ message: 'OK', data: cached, cached: true });
  }

  const apiUrl = `${WEATHER_API_URL}?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric&lang=th`;
  const response = await axios.get(apiUrl);
  const weatherData = response.data;
  weatherData.input_cityName = cityName;
  weatherData.expire = now + weatherCacheTTL;

  weatherCache[cityName] = weatherData;
  res.json({ message: 'OK', data: weatherData, cached: false });
});

const getWeatherNowAll = asyncHandler(async (req, res) => {
  logger.debug('getWeatherNowAll called');
  res.json({ message: 'OK', data: weatherCache });
});

module.exports = { getWeatherNow, getWeatherNowAll };
