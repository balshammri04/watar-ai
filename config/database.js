// config/database.js
const { Sequelize } = require('sequelize');

console.log("🧠 Loading database config...");

const sequelize = new Sequelize('watar_db', 'postgres', '1125946911', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

module.exports = sequelize;


