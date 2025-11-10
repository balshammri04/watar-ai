// models/Appointment.js
const { DataTypes } = require('sequelize');
const path = require('path');
const sequelize = require(path.join(__dirname, '../config/database'));
const Patient = require('./Patient');

const Appointment = sequelize.define('Appointment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  doctor: { type: DataTypes.STRING },
  date: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'scheduled' },
});

Patient.hasMany(Appointment, { foreignKey: 'patient_id', onDelete: 'CASCADE' });
Appointment.belongsTo(Patient, { foreignKey: 'patient_id' });

module.exports = Appointment;
