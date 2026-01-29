const sequelize = require("../config/database");
const Patient = require("./Patient");
const User = require("./User");
const Call = require("./Call");

// 👤 Call ↔ Patient
Call.belongsTo(Patient, {
  foreignKey: "patient_id",
  as: "patient",
});

// 👩‍💼 Call ↔ Agent (User)
Call.belongsTo(User, {
  foreignKey: "agent_id",
  as: "agent",
});

module.exports = {
  Patient,
  User,
  Call,
};
