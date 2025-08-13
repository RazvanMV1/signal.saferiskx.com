require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const stripeController = require('./controllers/stripeController.js');
const testRoutes = require('./routes/testRoutes.js');
const auth = require('./middlewares/auth.js'); 
const authRoutes = require('./routes/authRoutes.js'); 
const userRoutes = require('./routes/userRoutes.js');
const discordRoutes = require('./routes/discordRoutes.js');

const app = express();
const port = process.env.PORT || 5000;

// CORS optimizat pentru producție
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CORS_ORIGIN 
    : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};

app.use(cors(corsOptions));
app.use(cookieParser());

// Health check endpoint - ADAUGĂ AICI
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// IMPORTANT: Webhook-ul TREBUIE să fie ÎNAINTEA middleware-ului JSON
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeController.webhook);

// Middleware pentru JSON (după webhook)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Stripe routes (după middleware-ul JSON)
app.post('/api/stripe/create-session', auth, stripeController.createSession);
app.get('/api/stripe/session', auth, stripeController.getSession);
app.post('/api/stripe/create-portal-session', auth, stripeController.createPortalSession);

// Rute
app.use('/api/discord', discordRoutes);
app.use('/api', testRoutes); // Corectez typo-ul '/apai' -> '/api'
app.use('/api', authRoutes);
app.use('/api/user', userRoutes);

// Error handling middleware pentru producție
if (process.env.NODE_ENV === 'production') {
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'production' ? {} : err 
    });
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Serverul rulează pe http://localhost:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
