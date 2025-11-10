// models/Call.js
const { DataTypes } = require('sequelize');
const path = require('path');
const sequelize = require(path.join(__dirname, '../config/database'));
const Patient = require('./Patient');

const Call = sequelize.define('Call', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  start_time: { type: DataTypes.DATE },
  end_time: { type: DataTypes.DATE },
  transcript: { type: DataTypes.TEXT },
  intent: { type: DataTypes.STRING },
});

Patient.hasMany(Call, { foreignKey: 'patient_id', onDelete: 'SET NULL' });
Call.belongsTo(Patient, { foreignKey: 'patient_id' });

module.exports = Call;

 