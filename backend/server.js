// ============================================================================
// SkillSwap - Backend Express Server Entry Point
// ============================================================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { verifyConnection } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

const userRoutes = require('./routes/userRoutes');
const skillRoutes = require('./routes/skillRoutes');
const matchRoutes = require('./routes/matchRoutes');
const swapRoutes = require('./routes/swapRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const graphRoutes = require('./routes/graphRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SkillSwap Graph Engine API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/graph', graphRoutes);

// Error Handler
app.use(errorHandler);

// Start server and verify CognoDB connection
app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(`🌟 SkillSwap Server running at http://localhost:${PORT}`);
  console.log(`====================================================`);
  await verifyConnection();
});
