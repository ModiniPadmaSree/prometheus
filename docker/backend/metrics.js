const client = require('prom-client');
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

const resumeCreatedCounter = new client.Counter({
  name: 'resumes_created_total',
  help: 'Total number of resumes successfully created',
  registers: [register],
});
const resumeCreationFailedCounter = new client.Counter({
  name: 'resume_creation_failed_total',
  help: 'Total number of failed resume creation attempts',
  registers: [register],
});
module.exports = { client, register, httpRequestDuration, resumeCreatedCounter, resumeCreationFailedCounter};
