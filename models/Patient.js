// models/Patient.js
const { DataTypes } = require('sequelize');
const path = require('path');
const sequelize = require(path.join(__dirname, '../config/database'));

const Patient = sequelize.define('Patient', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, unique: true },
  national_id: { type: DataTypes.STRING, unique: true },
});

module.exports = Patient;

