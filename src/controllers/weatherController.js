const axios = require('axios').default;
const asyncHandler = require('express-async-handler');
const { weatherCacheTTL } = require('../config');

const apiKey = process.env.OPEN_WEATHER_KEY;
const weatherCache = {};

const getWeatherNow = asyncHandler(async (req, res) => {
  console.log('getWeatherNow called');
  const cityName = req.params.city;

  // Check cache and expiry
  const cached = weatherCache[cityName];
  if (cached && Date.now() / 1000 < cached.expire) {
    return res.json({ message: 'OK', data: cached, cached: true });
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}`;
  const response = await axios.get(apiUrl);
  const weatherData = response.data;
  weatherData.input_cityName = cityName;
  weatherData.expire = Math.floor(Date.now() / 1000) + weatherCacheTTL;

  weatherCache[cityName] = weatherData;
  res.json({ message: 'OK', data: weatherData, cached: false });
});

const getWeatherNowAll = asyncHandler(async (req, res) => {
  console.log('getWeatherNowAll called');
  res.json({ message: 'OK', data: weatherCache });
});

module.exports = { getWeatherNow, getWeatherNowAll };
