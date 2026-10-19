// Vercel serverless entrypoint: the platform calls this handler per request,
// so the Express app is exported instead of listening on a port.
const app = require('../server');

module.exports = app;
