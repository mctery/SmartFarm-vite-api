# SmartFarm-vite-api
SmartFarm-webapp

## API Routes

### `GET /api/sensors/device/type/:id/:type/:version?`

Retrieve sensor data for a device by sensor type. When the optional `version`
parameter is supplied, the result will be filtered to sensors matching that
version.
