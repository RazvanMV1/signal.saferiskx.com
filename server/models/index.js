const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: DB_PORT,
    logging: false,
  }
);

const User = require('./user')(sequelize);
// ...importă și alte modele aici

module.exports = { sequelize, User };
