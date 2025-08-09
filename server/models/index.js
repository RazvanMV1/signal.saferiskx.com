const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: 5432,
    logging: false,
  }
);

const User = require('./user')(sequelize);
// ...importă și alte modele aici

module.exports = { sequelize, User };
