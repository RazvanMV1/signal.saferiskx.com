require('dotenv').config({ path: '../../.env' });
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./models'); // vezi index.js la modele!

const app = express();

app.use(cors({ origin: "http://localhost:3001", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => res.send('Signal SafeRiskX API live!'));

const PORT = process.env.PORT || 5002;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Signal server running on port ${PORT}`));
});
