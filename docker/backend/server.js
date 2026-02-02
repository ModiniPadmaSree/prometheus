const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// 🔹 Import Prometheus metrics
const { client, httpRequestDuration } = require('./metrics');

// Load environment variables
dotenv.config();

// Import routes
const resumeRoutes = require('./routes/resumeRoutes');

// Initialize app
const app = express();

// =====================
// Middleware Setup
// =====================
app.use(
  cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

app.use(express.json());

// =====================
// 🔹 Prometheus Metrics Middleware (HERE)
// ===================
app.use((req, res, next) => {
 if (!req.path.startsWith('/api')) {
    return next();
  }
  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationInSeconds = diff[0] + diff[1] / 1e9;

    httpRequestDuration.observe(
      {
        method: req.method,
        route: req.baseUrl || req.path,
        status_code: res.statusCode,
      },
      durationInSeconds
    );
  });

  next();
});

// =====================
app.get('/', (req, res) => {
  res.send('Resume Builder API is running!');
});

app.use('/api/resumes', resumeRoutes);

// =====================
// 🔹 Metrics Endpoint
const { register } = require('./metrics');

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});


// =====================
// Server + DB
// =====================
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully!');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

