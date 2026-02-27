try {
  const { app, start } = require('./src/app');

  // When run directly (npm start / nodemon), start full server with MQTT + Socket.IO
  if (require.main === module) {
    start();
  }

  // Vercel serverless: export Express app (lazy DB via middleware in app.js)
  module.exports = app;
} catch (err) {
  console.error('SERVER BOOTSTRAP ERROR:', err);
  // Export a minimal error handler so Vercel can show the error
  const express = require('express');
  const errApp = express();
  errApp.use((req, res) => {
    res.status(500).json({ error: err.message, stack: err.stack });
  });
  module.exports = errApp;
}
