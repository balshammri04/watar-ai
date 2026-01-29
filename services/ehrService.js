// // services/ehrService.js

// const Clinic = require("../models/Clinic");
// const Doctor = require("../models/Doctor");
// const Slot = require("../models/Slot");

// exports.getClinics = async () => {
//   return Clinic.findAll();
// };

// exports.getDoctors = async () => {
//   return Doctor.findAll();
// };

// exports.getDoctorsByClinic = async (clinic_id) => {
//   return Doctor.findAll({ where: { clinic_id } });
// };

// exports.getSlots = async () => {
//   return Slot.findAll();
// };

// exports.getSlotsByDoctor = async (doctor_id) => {
//   return Slot.findAll({ where: { doctor_id } });
// };

// exports.getSlotsByClinic = async (clinic_id, date) => {
//   return Slot.findAll({
//     where: {
//       clinic_id,
//       date,
//       status: "متاح",
//     },
//     include: [
//       {
//         model: Doctor,
//         attributes: ["id", "name"],
//       },
//     ],
//     order: [
//       ["time", "ASC"],   // الأوقات الأقرب أولًا
//     ],
//     limit: 3,            // 🔥 أهم سطر
//   });
// };



const Clinic = require("../models/Clinic");
const Doctor = require("../models/Doctor");
const Slot = require("../models/Slot");

exports.getClinics = async () => {
  return Clinic.findAll();
};

exports.getDoctors = async () => {
  return Doctor.findAll();
};

exports.getDoctorsByClinic = async (clinic_id) => {
  return Doctor.findAll({ where: { clinic_id } });
};

exports.getSlots = async () => {
  return Slot.findAll();
};

exports.getSlotsByDoctor = async (doctor_id) => {
  return Slot.findAll({ where: { doctor_id } });
};

exports.getSlotsByClinic = async (clinic_id) => {
  return Slot.findAll({ where: { clinic_id } });
};