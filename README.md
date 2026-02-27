# SmartFarm API

REST API server for the SmartFarm IoT platform — manages devices, sensors, real-time data, user authentication, RBAC permissions, and dynamic menu system.

## Tech Stack

- **Runtime:** Node.js + Express
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JWT (access + refresh tokens) + bcrypt
- **Real-time:** MQTT (sensor data ingestion) + Socket.IO (WebSocket push to frontend)
- **Validation:** Joi
- **Security:** Helmet, CORS, rate limiting
- **Logging:** Winston

## Getting Started

### Prerequisites

- Node.js >= 16
- MongoDB instance (local or Atlas)
- MQTT broker (e.g. Mosquitto, HiveMQ)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development
MONGO_URL=mongodb+srv://<user>:<pass>@<cluster>/<db>
TOKEN_KEY=your_jwt_secret
JWT_EXPIRY=12h
REFRESH_TOKEN_KEY=your_refresh_secret
REFRESH_EXPIRY=7d
MQTT_URL=mqtt://<broker-host>
FRONTEND=http://localhost:5173
SOCKET_PORT=3200
OPEN_WEATHER_KEY=your_openweathermap_key
```

### Run

```bash
# Development (API + Socket.IO server with auto-reload)
npm start

# API server only
npm run dev

# Production
npm run serve
```

### Tests

```bash
npm test
```

16 test suites covering all controllers and middleware. Uses a lightweight custom test runner with `require.cache` patching (no external test framework).

## Project Structure

```
src/
├── config/
│   ├── index.js          # Central config (env vars + defaults)
│   ├── logger.js         # Winston logger setup
│   ├── mqtt.js           # MQTT client factory + topic subscription
│   └── permissions.js    # RBAC permission definitions (33 permissions)
├── controllers/          # Route handlers (13 controllers)
├── middleware/
│   ├── authorization.js  # JWT verification
│   ├── checkPermission.js# RBAC permission + admin check
│   ├── ownershipCheck.js # Device ownership verification
│   ├── validate.js       # Joi schema validation
│   ├── errorMiddleware.js# Global error handler
│   ├── requestLogger.js  # HTTP request logging
│   └── auditLogger.js    # Mutation audit trail
├── models/               # Mongoose schemas (13 models)
├── routes/               # Express routers (13 route files)
├── services/
│   └── mqttHandler.js    # MQTT message processing + threshold checks
├── utils/
│   ├── getUserId.js      # User ID normalization
│   └── pagination.js     # Pagination helpers
├── validations/          # Joi schemas (10 validation files)
├── scripts/
│   ├── seedSampleData.js # Seed test data
│   ├── migrateRoles.js   # Migrate user roles + permissions
│   └── migrateMenus.js   # Seed menus + assign to users
├── socketServer.js       # Socket.IO bridge (MQTT → WebSocket)
└── app.js                # Express app bootstrap
server.js                 # Entry point
tests/                    # Test suites (16 files)
```

## Database Models

| Model | Collection | Description |
|-------|-----------|-------------|
| User | `users` | User accounts with email/password, role (admin/user) |
| Device | `devices` | IoT devices linked to users |
| Sensor | `sensors` | Sensors attached to devices (temperature, humidity, light, soil) |
| SensorData | `sensordatas` | Time-series sensor readings (TTL: 90 days) |
| SensorWidget | `sensorwidgets` | Dashboard widget configurations per device |
| SensorThreshold | `sensorthresholds` | Alert thresholds for sensor values |
| Notification | `notifications` | In-app notifications (threshold alerts, device status) |
| DeviceLog | `devicelogs` | Device online/offline events (TTL: 30 days) |
| AuditLog | `auditlogs` | User action audit trail (TTL: 365 days) |
| UserSetting | `usersettings` | Per-user preferences (timezone, language, notifications) |
| Permission | `permissions` | Per-user RBAC permissions |
| Menu | `menus` | Navigation menu items (2-level hierarchy) |
| UserMenu | `usermenus` | Per-user menu access assignments |

## API Endpoints

Base URL: `/api`

### Authentication (`/users`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/users/login` | No | Login (returns tokens + permissions + menus) |
| POST | `/users/register` | No | Register new user |
| POST | `/users/refresh` | No | Refresh access token |
| POST | `/users/token` | No | Verify/decode token |

### Users (`/users`)

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| GET | `/users` | Auth | List all active users |
| GET | `/users/me` | Auth | Get own profile |
| PUT | `/users/me` | Auth | Update own profile |
| GET | `/users/:id` | `users:read` | Get user by ID |
| PUT | `/users/:id` | `users:write` | Update user |
| DELETE | `/users/:id` | `users:delete` | Soft-delete user |

### Devices (`/devices`)

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| GET | `/devices` | `devices:read` | List devices (paginated) |
| POST | `/devices` | `devices:write` | Create device |
| GET | `/devices/user/:user_id` | `devices:read` | Get user's devices |
| GET | `/devices/:id` | `devices:read` | Get device |
| PUT | `/devices/:id` | `devices:write` | Update device |
| DELETE | `/devices/:id` | `devices:delete` | Soft-delete device |
| POST | `/devices/:id/commands` | `devices:command` | Send MQTT command |

### Sensors (`/sensors`)

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| GET | `/sensors` | `sensors:read` | List all sensors |
| POST | `/sensors` | `sensors:write` | Create sensor |
| GET | `/sensors/device/:id` | `sensors:read` + ownership | Device sensors |
| GET | `/sensors/device/type/:id/:type` | `sensors:read` + ownership | Device sensors by type |
| GET | `/sensors/:id` | `sensors:read` | Get sensor |
| PUT | `/sensors/:id` | `sensors:write` | Update sensor |
| DELETE | `/sensors/:id` | `sensors:delete` | Soft-delete sensor |

### Sensor Data (`/sensorsdata`)

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| POST | `/sensorsdata/find` | `sensor_data:read` + ownership | Query sensor data |
| POST | `/sensorsdata/range` | `sensor_data:read` + ownership | Query by date range |
| POST | `/sensorsdata/create` | `sensor_data:write` + ownership | Bulk insert data |
| POST | `/sensorsdata/aggregate` | `sensor_data:read` + ownership | Aggregated stats (avg/min/max) |

### Sensor Widgets (`/sensorWidget`)

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| GET | `/sensorWidget/:device_id` | `widgets:read` | Get widget config |
| POST | `/sensorWidget` | `widgets:write` | Create widget |
| PUT | `/sensorWidget/:device_id` | `widgets:write` | Update widget |
| DELETE | `/sensorWidget/:device_id` | `widgets:delete` | Delete widget |

### Thresholds (`/thresholds`)

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| POST | `/thresholds` | `thresholds:write` | Create threshold |
| GET | `/thresholds/device/:device_id` | `thresholds:read` | Get by device |
| GET | `/thresholds/user/:user_id` | `thresholds:read` | Get by user |
| PUT | `/thresholds/:id` | `thresholds:write` | Update threshold |
| DELETE | `/thresholds/:id` | `thresholds:delete` | Deactivate threshold |

### Notifications (`/notifications`)

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| GET | `/notifications/user/:user_id` | `notifications:read` | Get notifications |
| GET | `/notifications/user/:user_id/unread-count` | `notifications:read` | Unread count |
| PUT | `/notifications/:id/read` | `notifications:write` | Mark as read |
| PUT | `/notifications/user/:user_id/read-all` | `notifications:write` | Mark all as read |
| DELETE | `/notifications/:id` | `notifications:write` | Delete notification |

### Weather (`/weather`)

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| GET | `/weather` | `weather:read` | All cached weather data |
| GET | `/weather/:city` | `weather:read` | Weather by city (cached 1h) |

### Menus (`/menus`)

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| GET | `/menus/accessible` | Auth (any) | User's accessible menus (hierarchy) |
| GET | `/menus` | `menus:read` | List all menus |
| POST | `/menus` | `menus:write` | Create menu |
| GET | `/menus/:id` | `menus:read` | Get menu |
| PUT | `/menus/:id` | `menus:write` | Update menu |
| DELETE | `/menus/:id` | `menus:delete` | Soft-delete menu |

### Device Logs (`/device-logs`)

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| GET | `/device-logs/:device_id` | `device_logs:read` | Device event logs |
| GET | `/device-logs/:device_id/online-history` | `device_logs:read` | Online/offline history |

### Audit Logs (`/audit-logs`)

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| GET | `/audit-logs` | `audit_logs:read` | Query audit logs (filterable) |
| GET | `/audit-logs/:resource_type/:resource_id` | `audit_logs:read` | Logs by resource |

### User Settings (`/settings`)

| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| GET | `/settings/:user_id` | `settings:read` | Get settings (auto-creates defaults) |
| PUT | `/settings/:user_id` | `settings:write` | Update settings |

### Admin (`/admin`)

All routes require admin role.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/users` | List users (search + pagination) |
| GET | `/admin/users/:id` | Get user + permissions |
| PUT | `/admin/users/:id/role` | Update user role |
| GET | `/admin/users/:id/permissions` | Get user permissions |
| PUT | `/admin/users/:id/permissions` | Update user permissions |
| GET | `/admin/users/:id/menus` | Get user menu assignments |
| PUT | `/admin/users/:id/menus` | Update user menu assignments |
| GET | `/admin/permissions` | Permission group definitions |
| GET | `/admin/menus` | All active menus |

### Health Check

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Returns `{ status: 'ok' }` |

## MQTT Topics

The API subscribes to these MQTT topics for real-time sensor data:

| Topic Pattern | Description |
|---------------|-------------|
| `device/+/temperature` | Temperature readings |
| `device/+/humidity` | Humidity readings |
| `device/+/light` | Light intensity readings |
| `device/+/soil` | Soil moisture readings |
| `device/+/checkin` | Device online heartbeat |
| `device/+/will` | Device offline (LWT) |

Command publishing: `request/{device_id}/{command}`

## Security Features

- **JWT Authentication** — access token (12h) + refresh token (7d)
- **RBAC Permissions** — 33 granular permissions across 14 modules; admin wildcard (`*`)
- **Per-user Menu Access** — dynamic navigation based on DB-driven menu assignments
- **Device Ownership** — middleware verifies user owns the device before data access
- **Rate Limiting** — global (100 req/15min) + auth endpoints (10 req/15min)
- **Helmet** — secure HTTP headers
- **CORS** — configurable origin whitelist
- **Input Validation** — Joi schemas on all endpoints with `stripUnknown`
- **Audit Logging** — all mutations recorded with user, action, changes, IP
- **Soft Deletes** — data preserved with status flag (`A`/`D`)
- **TTL Indexes** — automatic cleanup of sensor data (90d), device logs (30d), audit logs (365d)

## Migration Scripts

```bash
# Seed menu data and assign to existing users
node src/scripts/migrateMenus.js

# Migrate user roles and create permission documents
node src/scripts/migrateRoles.js

# Seed sample data (development only — clears existing data)
node src/scripts/seedSampleData.js
```

All migration scripts are idempotent (safe to run multiple times).

## Socket.IO Server

Runs separately on port 3200 (configurable via `SOCKET_PORT`). Bridges MQTT sensor data to WebSocket for real-time frontend updates.

Events emitted: `temperatureData`, `humidityData`, `lightData`, `soilData`
