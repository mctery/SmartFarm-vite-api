const axios = require('axios').default;
const asyncHandler = require('express-async-handler');

const apiKey = '61a7721545d33e17c99cb86a264ee6ad';
const weatherCache = {};

const getWeatherNow = asyncHandler(async (req, res) => {
  try {
    const cityName = req.params.city

    // Check if weather data for this city is in the cache
    if (weatherCache[cityName]) {
      
      res.status(200).json({ old_data: weatherCache[cityName] });
    } else {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

      // Fetch weather data from the API
      const response = await axios.get(apiUrl);
      const weatherData = response.data;
      response.data['input_cityName'] = cityName
      response.data['expire'] = weatherData.dt + 3600

      // Store data in cache
      weatherCache[cityName] = weatherData;

      res.status(200).json({ new_data: weatherData });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const getWeatherNowAll = asyncHandler(async (req, res) => {
    try {
        res.status(200).json(weatherCache)
    } catch(error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = { getWeatherNow, getWeatherNowAll };
