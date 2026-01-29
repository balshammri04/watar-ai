const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ClinicConfig = sequelize.define("ClinicConfig", {
  clinic_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  working_hours: {
    type: DataTypes.STRING, 
    allowNull: true,
  },
  slot_duration_minutes: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    defaultValue: 20,
  },
  timezone: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Asia/Riyadh",
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = ClinicConfig;
