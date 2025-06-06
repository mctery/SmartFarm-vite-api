# SmartFarm-vite-api
SmartFarm-webapp

## API Routes

### `GET /api/sensors/device/type/:id/:type/:version?`

Retrieve sensor data for a device by sensor type. When the optional `version`
parameter is supplied, the result will be filtered to sensors matching that
version.

## Environment Variables

Create a `.env` file based on `.env.example` and provide values for:

- `PORT` - Port for the Express server.
- `MONGO_URL` - MongoDB connection string.
- `MQTT_URL` - MQTT broker URL.
- `FRONTEND` - Allowed CORS origin.
- `TOKEN_KEY` - JWT signing key.
- `OPEN_WEATHER_KEY` - API key for OpenWeatherMap.
