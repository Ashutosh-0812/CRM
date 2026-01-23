const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const envProperties = require('../properties/envProperties');

const configureServer = (app) => {
  // CORS configuration
  app.use(cors({
    origin: envProperties.corsOrigin,
    credentials: true
  }));

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Cookie parser
  app.use(cookieParser());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'OK', 
      message: 'CRM Backend is running',
      timestamp: new Date().toISOString(),
      environment: envProperties.nodeEnv
    });
  });

  return app;
};

module.exports = configureServer;
