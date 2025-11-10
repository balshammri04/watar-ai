const { Sequelize } = require('sequelize');

console.log("🧠 Loading database config...");

const sequelize = new Sequelize('watar_db', 'postgres', '1125946911', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log,
});

module.exports = sequelize;
