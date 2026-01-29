const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Clinic = sequelize.define("Clinic", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Clinic;
