# SmartFarm-vite-api

SmartFarm-webapp

Copy `.env.example` to `.env` and fill in your environment variables. The API now expects `OPEN_WEATHER_KEY` for accessing OpenWeather.

## API Routes

### `GET /api/sensors/device/type/:id/:type/:version?`

Retrieve sensor data for a device by sensor type. When the optional `version`
parameter is supplied, the result will be filtered to sensors matching that
version.
