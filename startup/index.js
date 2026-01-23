const express = require('express');
const database = require('../database');
const configureServer = require('../services/serverService');
const { errorHandler } = require('../middlewares');
const { loginRoutes, registerRoutes, customerRoutes, leadRoutes } = require('../modules');
const envProperties = require('../properties/envProperties');
const logger = require('../logging/logging');

const initializeApp = async () => {
  try {
    // Initialize database
    logger.info('Initializing database...');
    await database.initializeAllDatabases();

    // Create Express app
    const app = express();

    // Configure server middleware
    configureServer(app);

    // Register API routes
    app.use('/api/auth', loginRoutes);
    app.use('/api/auth', registerRoutes);
    app.use('/api/customers', customerRoutes);
    app.use('/api/leads', leadRoutes);

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    });

    // Error handler (must be last)
    app.use(errorHandler);

    return app;
  } catch (error) {
    logger.error('Failed to initialize application:', error);
    throw error;
  }
};

const startServer = async (app) => {
  try {
    const PORT = envProperties.port;

    app.listen(PORT, () => {
      logger.info(`🚀 CRM Backend server started on http://localhost:${PORT}`);
      logger.info(`📦 Environment: ${envProperties.nodeEnv}`);
      logger.info(`🔍 API Documentation: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    throw error;
  }
};

module.exports = {
  initializeApp,
  startServer
};
