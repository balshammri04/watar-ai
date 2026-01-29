// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/database");
// const Doctor = require("./Doctor");
// const Clinic = require("./Clinic");

// const Slot = sequelize.define(
//   "Slot",
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },

//     date: {
//       type: DataTypes.DATEONLY,
//       allowNull: false,
//     },

//     time: {
//       type: DataTypes.TIME,
//       allowNull: false,
//     },

//     end_time: {
//       type: DataTypes.TIME,
//       allowNull: false,
//     },

//     status: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       defaultValue: "Available",
//     },
//   },
//   {
//     tableName: "Slots",
//     timestamps: true,
//     underscored: false,
//     indexes: [
//       {
//         unique: true,
//         fields: ["doctor_id", "date", "time"],
//         name: "ux_slots_doctor_date_time",
//       },
//     ],

//     /* ==================================================
//        🔽🔽🔽 إضافة زميلتك (بدون تعديل أي شي) 🔽🔽🔽
//     =================================================== */
//     hooks: {
//       beforeCreate(slot) {
//         if (slot.status === "Available") {
//           slot.status = "متاح";
//         }
//       },
//       beforeUpdate(slot) {
//         if (slot.status === "Available") {
//           slot.status = "متاح";
//         }
//       },
//     },
//   }
// );

// // Relations (كما هي)
// Doctor.hasMany(Slot, { foreignKey: "doctor_id" });
// Slot.belongsTo(Doctor, { foreignKey: "doctor_id" });

// Clinic.hasMany(Slot, { foreignKey: "clinic_id" });
// Slot.belongsTo(Clinic, { foreignKey: "clinic_id" });

// module.exports = Slot;


const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Doctor = require("./Doctor");
const Clinic = require("./Clinic");


const Slot = sequelize.define("Slot", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Available",
  },
});

// Relations
Doctor.hasMany(Slot, { foreignKey: "doctor_id" });
Slot.belongsTo(Doctor, { foreignKey: "doctor_id" });

Clinic.hasMany(Slot, { foreignKey: "clinic_id" });
Slot.belongsTo(Clinic, { foreignKey: "clinic_id" });

module.exports = Slot;