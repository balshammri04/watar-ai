const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Patient = require("./Patient");
const Clinic = require("./Clinic");
const Doctor = require("./Doctor");
const Slot = require("./Slot");


const Appointment = sequelize.define("Appointment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  appointment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  appointment_time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "scheduled",
  },
});

// Relations
Patient.hasMany(Appointment, { foreignKey: "patient_id", onDelete: "CASCADE" });
Appointment.belongsTo(Patient, { foreignKey: "patient_id" });

Clinic.hasMany(Appointment, { foreignKey: "clinic_id" });
Appointment.belongsTo(Clinic, { foreignKey: "clinic_id" });

Doctor.hasMany(Appointment, { foreignKey: "doctor_id" });
Appointment.belongsTo(Doctor, { foreignKey: "doctor_id" });

Slot.hasOne(Appointment, { foreignKey: "slot_id" });
Appointment.belongsTo(Slot, { foreignKey: "slot_id" });

module.exports = Appointment;
