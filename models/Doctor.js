const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Clinic = require("./Clinic");


const Doctor = sequelize.define("Doctor", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  specialty: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Relations
Clinic.hasMany(Doctor, { foreignKey: "clinic_id" });
Doctor.belongsTo(Clinic, { foreignKey: "clinic_id" });

module.exports = Doctor;
