//models/Call.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Call = sequelize.define("Call", {
  call_sid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  // 📞 inbound / outbound
  direction: {
  type: DataTypes.STRING,
  allowNull: false,
  defaultValue: "inbound",
},

  // 🤖 AI or 👤 Human
  call_type: {
  type: DataTypes.STRING,
  allowNull: false,
  defaultValue: "ai",
},

  caller_number: DataTypes.STRING,

  // 👤 المريض
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  // 👩‍💼 Agent (handoff)
  agent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // 🔄 الحالة التشغيلية
  status: {
  type: DataTypes.STRING,
  allowNull: false,
  defaultValue: "ringing",
},

  // 🎯 النتيجة النهائية
outcome: {
  type: DataTypes.STRING,
  allowNull: true,
},

  transcript: DataTypes.TEXT,
  intent: DataTypes.STRING,

  // ⏰ وقت حدوث المكالمة
  start_time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },

  end_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  // ⏱ مدة المكالمة
  duration_seconds: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

}, {
  tableName: "Calls",
  timestamps: true,
});

module.exports = Call;
