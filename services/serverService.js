const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const envProperties = require('../properties/envProperties');

const configureServer = (app) => {
 
  app.use(cors({
    origin: envProperties.corsOrigin,
    credentials: true
  }));


  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  app.use(cookieParser());

 
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
