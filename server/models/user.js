const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    discordId: { type: DataTypes.STRING, allowNull: true },
  });
  return User;
};


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { sequelize, testConnection } = require('./config/database');
const initializeModels = require('./models');
const initializeRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting global (pentru toate rutele)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute
  max: 100, // limită la 100 de requests per 15 minute per IP
  message: {
    success: false,
    error: 'Prea multe încercări. Încearcă din nou în 15 minute.'
  }
});

// Inițializează modelele
const models = initializeModels(sequelize);

// Funcție pentru inițializarea aplicației
const startServer = async () => {
  try {
    // Testează conexiunea la baza de date
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Nu se poate porni serverul fără conexiune la baza de date');
      process.exit(1);
    }

    // Sincronizează modelele cu baza de date
    await sequelize.sync({ force: false });
    console.log('✅ Modelele au fost sincronizate cu baza de date');

    // Middleware
    app.use(limiter); // Aplică rate limiting global
    
    app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost',
      credentials: true, // Important pentru cookies
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser()); // Pentru gestionarea cookies

    // Inițializează rutele
    initializeRoutes(app, models);

    // Test route
    app.get('/api/test', async (req, res) => {
      try {
        const userCount = await models.User.count();
        
        res.json({ 
          message: 'Server funcționează!',
          database: 'connected',
          userCount: userCount,
          availableRoutes: [
            'POST /api/register',
            'POST /api/login', 
            'GET /api/activate',
            'POST /api/logout',
            'GET /api/me',
            'POST /api/change-password',
            'GET /api/subscription',
            'GET /api/check-subscription',
            'GET /api/users',
            'POST /api/users'
          ],
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Eroare la conectarea cu baza de date'
        });
      }
    });

    // Health check
    app.get('/health', async (req, res) => {
      try {
        await sequelize.authenticate();
        const userCount = await models.User.count();
        
        res.json({ 
          status: 'OK', 
          database: 'connected',
          models: 'synchronized',
          userCount: userCount,
          timestamp: new Date().toISOString() 
        });
      } catch (error) {
        res.status(503).json({ 
          status: 'ERROR', 
          database: 'disconnected',
          error: error.message,
          timestamp: new Date().toISOString() 
        });
      }
    });

    // Middleware pentru gestionarea erorilor
    app.use((error, req, res, next) => {
      console.error('Server Error:', error);
      res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
      });
    });

    // Middleware pentru rute inexistente
    app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Ruta nu a fost găsită'
      });
    });

    // Pornește serverul
    app.listen(PORT, () => {
      console.log(`🚀 Server rulează pe portul ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Modele disponibile: ${Object.keys(models).join(', ')}`);
      console.log(`🛣️  API disponibil la: http://localhost:${PORT}/api`);
    });

  } catch (error) {
    console.error('❌ Eroare la pornirea serverului:', error);
    process.exit(1);
  }
};

// Gestionează închiderea gracioasă
process.on('SIGTERM', async () => {
  console.log('🔄 Închidere gracioasă în curs...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 Închidere gracioasă în curs...');
  await sequelize.close();
  process.exit(0);
});

// Pornește aplicația
startServer();

