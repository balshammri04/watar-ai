const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");


const Log = sequelize.define("Log", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  action: {
    type: DataTypes.STRING, // GET / POST / PUT / DELETE
    allowNull: false,
  },
  endpoint: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING, // success / failed
    allowNull: false,
  },
  ip: {
    type: DataTypes.STRING,
  },
  details: {
    type: DataTypes.TEXT, // JSON string (body, params, query)
  },
});

// Relations
User.hasMany(Log, { foreignKey: "user_id", onDelete: "SET NULL" });
Log.belongsTo(User, { foreignKey: "user_id" });

module.exports = Log;
