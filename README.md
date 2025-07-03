# SmartFarm-vite-api

SmartFarm-webapp

Copy `.env.example` to `.env` and fill in your environment variables. The API now expects `OPEN_WEATHER_KEY` for accessing OpenWeather.


## Project Structure

```
src/
├── app.js
├── controllers/
├── middleware/
├── models/
├── mqtt.js
├── routes/
├── scripts/
└── socketServer.js
tests/
```

## API Routes

### `GET /api/sensors/device/type/:id/:type`

Retrieve sensor data for a device by sensor type. Sensors are returned for the
specified device and sensor type.

## Environment Variables

Create a `.env` file based on `.env.example` and provide values for:

- `PORT` - Port for the Express server.
- `MONGO_URL` - MongoDB connection string.
- `MQTT_URL` - MQTT broker URL.
- `FRONTEND` - Allowed CORS origin.
- `TOKEN_KEY` - JWT signing key.
- `OPEN_WEATHER_KEY` - API key for OpenWeatherMap.

## Seeding Sample Data

Run `node scripts/seedSampleData.js` to populate all models with ten sample
records for testing and development.
