// const sequelize = require("../config/database");
// const Appointment = require("../models/Appointment");
// const Patient = require("../models/Patient");
// const Clinic = require("../models/Clinic");
// const Doctor = require("../models/Doctor");
// const Slot = require("../models/Slot");

// /* =========================
//    GET all appointments
// ========================= */
// exports.getAllAppointments = async (req, res) => {
//   try {
//     const appointments = await Appointment.findAll({
//       include: [
//         { model: Patient, attributes: ["id", "name", "phone"] },
//         { model: Clinic, attributes: ["id", "name"] },
//         { model: Doctor, attributes: ["id", "name"] },
//       ],
//       order: [["appointment_date", "ASC"]],
//     });

//     return res.json({
//       message: "All appointments fetched successfully",
//       data: appointments,
//     });
//   } catch (err) {
//     console.error("❌ Fetch appointments error:", err);
//     return res.status(500).json({ error: err.message });
//   }
// };

// /* =========================
//    CREATE appointment (VOICE SAFE)
// ========================= */
// exports.createAppointment = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { patient_id, clinic_id, doctor_id, slot_id } = req.body;

//     if (!patient_id || !clinic_id || !doctor_id || !slot_id) {
//       throw new Error("Missing required fields");
//     }

//     const patient = await Patient.findByPk(patient_id, { transaction });
//     if (!patient) throw new Error("Patient not found");

//     const clinic = await Clinic.findByPk(clinic_id, { transaction });
//     if (!clinic) throw new Error("Clinic not found");

//     const doctor = await Doctor.findOne({
//       where: { id: doctor_id, clinic_id },
//       transaction,
//     });
//     if (!doctor) throw new Error("Doctor not in this clinic");

//     const slot = await Slot.findOne({
//       where: { id: slot_id, doctor_id, clinic_id },
//       transaction,
//       lock: transaction.LOCK.UPDATE,
//     });

//     if (!slot) throw new Error("Slot not found");
//     if (slot.status !== "Available") throw new Error("Slot already booked");

//     const existing = await Appointment.findOne({
//       where: { slot_id },
//       transaction,
//       lock: transaction.LOCK.UPDATE,
//     });
//     if (existing) throw new Error("Slot already booked");

//     const appointment = await Appointment.create(
//       {
//         patient_id,
//         clinic_id,
//         doctor_id,
//         slot_id,
//         appointment_date: slot.date,
//         appointment_time: slot.time,
//         source: "voice",
//       },
//       { transaction }
//     );

//     await slot.update({ status: "Not Available" }, { transaction });

//     await transaction.commit();

//     return res.status(201).json({
//       message: "Appointment booked successfully",
//       data: appointment,
//     });
//   } catch (err) {
//     await transaction.rollback();
//     console.error("❌ Create appointment error:", err.message);
//     return res.status(400).json({ error: err.message });
//   }
// };


// /* =========================
//    CANCEL appointment (SAFE VERSION)
// ========================= */
// exports.cancelAppointment = async (req, res) => {
//   const t = await sequelize.transaction();

//   try {
//     const { id } = req.params;

//     // 1️⃣ Lock ONLY appointment
//     const appointment = await Appointment.findByPk(id, {
//       transaction: t,
//       lock: t.LOCK.UPDATE,
//     });

//     if (!appointment) {
//       await t.rollback();
//       return res.status(404).json({ error: "Appointment not found" });
//     }

//     if (appointment.status === "cancelled") {
//       await t.rollback();
//       return res
//         .status(400)
//         .json({ error: "Appointment already cancelled" });
//     }

//     // 2️⃣ Update appointment
//     await appointment.update(
//       { status: "cancelled" },
//       { transaction: t }
//     );

//     // 3️⃣ Free slot
//     await Slot.update(
//       { status: "Available" },
//       { where: { id: appointment.slot_id }, transaction: t }
//     );

//     await t.commit();

//     // 4️⃣ Fetch doctor & clinic AFTER commit
//     const doctor = await Doctor.findByPk(appointment.doctor_id, {
//       attributes: ["name"],
//     });

//     const clinic = await Clinic.findByPk(appointment.clinic_id, {
//       attributes: ["name"],
//     });

//     const message = `Your appointment with Dr. ${doctor?.name}
// at ${appointment.appointment_time}
// in ${clinic?.name} has been cancelled.`;

//     return res.json({ message });

//   } catch (err) {
//     await t.rollback();
//     return res.status(500).json({ error: err.message });
//   }
// };


// /* =========================
//    RESCHEDULE appointment (SAFE VERSION)
// ========================= */
// exports.rescheduleAppointment = async (req, res) => {
//   const t = await sequelize.transaction();

//   try {
//     const { id } = req.params;
//     const { new_slot_id } = req.body;

//     // 0️⃣ Validate input
//     if (!new_slot_id) {
//       await t.rollback();
//       return res.status(400).json({ error: "new_slot_id is required" });
//     }

//     // 1️⃣ Lock ONLY the appointment (NO include)
//     const appointment = await Appointment.findByPk(id, {
//       transaction: t,
//       lock: t.LOCK.UPDATE,
//     });

//     if (!appointment) {
//       await t.rollback();
//       return res.status(404).json({ error: "Appointment not found" });
//     }

//     if (appointment.status === "cancelled") {
//       await t.rollback();
//       return res
//         .status(400)
//         .json({ error: "Cannot reschedule cancelled appointment" });
//     }

//     // 2️⃣ Lock old slot
//     const oldSlot = await Slot.findByPk(appointment.slot_id, {
//       transaction: t,
//       lock: t.LOCK.UPDATE,
//     });

//     if (!oldSlot) {
//       await t.rollback();
//       return res.status(404).json({ error: "Old slot not found" });
//     }

//     // 3️⃣ Lock new slot
//     const newSlot = await Slot.findByPk(new_slot_id, {
//       transaction: t,
//       lock: t.LOCK.UPDATE,
//     });

//     if (!newSlot || newSlot.status !== "Available") {
//       await t.rollback();
//       return res.status(400).json({ error: "New slot not available" });
//     }

//     // 4️⃣ Update appointment
//     await appointment.update(
//       {
//         slot_id: new_slot_id,
//         appointment_date: newSlot.date,
//         appointment_time: newSlot.time,
//         status: "rescheduled",
//       },
//       { transaction: t }
//     );

//     // 5️⃣ Update slots
//     await oldSlot.update({ status: "Available" }, { transaction: t });
//     await newSlot.update({ status: "Not Available" }, { transaction: t });

//     await t.commit();

//     // 6️⃣ Fetch doctor & clinic safely (NO TRANSACTION, NO LOCK)
//     const doctor = await Doctor.findByPk(appointment.doctor_id, {
//       attributes: ["name"],
//     });

//     const clinic = await Clinic.findByPk(appointment.clinic_id, {
//       attributes: ["name"],
//     });

//     // 7️⃣ Build message safely
//     const message = `Your appointment${
//       doctor ? ` with Dr. ${doctor.name}` : ""
//     } has been rescheduled to ${appointment.appointment_time}${
//       clinic ? ` in ${clinic.name}` : ""
//     }.`;

//     // 8️⃣ Return response
//     return res.json({
//       message,
//       data: appointment,
//     });

//   } catch (err) {
//     await t.rollback();
//     return res.status(500).json({ error: err.message });
//   }
// };




const { Op } = require("sequelize");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Clinic = require("../models/Clinic");
const Doctor = require("../models/Doctor");
const Slot = require("../models/Slot");
const sequelize = require("../config/database");

//get all appointments 
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [{ model: Patient, attributes: ["id", "name", "phone"] }],
    });

    res.json({
      message: "All appointments fetched successfully",
      data: appointments,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Slots available for booking (future only)
exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctor_id, clinic_id } = req.query;
    const today = new Date().toISOString().split("T")[0];

    const slots = await Slot.findAll({
      where: {
        status: "Available",
        doctor_id,
        clinic_id,
        date: {
          [Op.gte]: today
        }
      },
      order: [["date", "ASC"], ["time", "ASC"]],
    });

    return res.json({
      message: "Available slots fetched",
      data: slots,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// Create appointment
exports.createAppointment = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { patient_id, clinic_id, doctor_id, slot_id } = req.body;

    if (!patient_id || !clinic_id || !doctor_id || !slot_id) {
      await t.rollback();
      return res.status(400).json({ error: "Missing required fields" });
    }

    const patient = await Patient.findByPk(patient_id, { transaction: t });
    if (!patient) {
      await t.rollback();
      return res.status(404).json({ error: "Patient not found" });
    }

    const clinic = await Clinic.findByPk(clinic_id, { transaction: t });
    if (!clinic) {
      await t.rollback();
      return res.status(404).json({ error: "Clinic not found" });
    }

    const doctor = await Doctor.findOne({
      where: { id: doctor_id, clinic_id },
      transaction: t,
    });
    if (!doctor) {
      await t.rollback();
      return res.status(404).json({ error: "Doctor not in this clinic" });
    }

    // ✅ نقفل السلووت (FOR UPDATE) عشان ما ينحجز بنفس اللحظة
    const slot = await Slot.findOne({
      where: { id: slot_id, doctor_id, clinic_id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!slot) {
      await t.rollback();
      return res.status(404).json({ error: "Slot not found" });
    }

    // ✅ إذا السلووت أصلاً غير متاح
    if (slot.status !== "Available") {
      await t.rollback();
      return res.status(400).json({ error: "Slot already not available" });
    }

    // ✅ حماية إضافية (حتى لو status ما تغيّر)
    const exists = await Appointment.findOne({
      where: { slot_id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (exists) {
      await t.rollback();
      return res.status(400).json({ error: "Slot already scheduled" });
    }

    const appointment = await Appointment.create(
      {
        patient_id,
        clinic_id,
        doctor_id,
        slot_id,
        appointment_date: slot.date,
        appointment_time: slot.time,
      },
      { transaction: t }
    );

    // ✅ هنا التحديث المهم
    await slot.update({ status: "Not Available" }, { transaction: t });

    await t.commit();
    return res.status(201).json({
      message: "Appointment created successfully",
      data: appointment,
    });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ error: err.message });
  }
};
// ✅ Appointments that can be cancelled (future + booked)
exports.getCancellableAppointments = async (req, res) => {
  try {
    const { patient_id } = req.query;
    const today = new Date().toISOString().split("T")[0];

    const appointments = await Appointment.findAll({
      where: {
        patient_id,
        status: "scheduled",
        appointment_date: {
          [Op.gte]: today
        }
      },
      include: [
        { model: Doctor, attributes: ["name"] },
        { model: Clinic, attributes: ["name"] },
      ],
      order: [["appointment_date", "ASC"]],
    });

    return res.json({
      message: "Cancellable appointments fetched",
      data: appointments,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// cancel Appointment
exports.cancelAppointment = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;

    // 1️⃣ Lock ONLY the appointment
    const appointment = await Appointment.findByPk(id, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!appointment) {
      await t.rollback();
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (appointment.status === "cancelled") {
      await t.rollback();
      return res.status(400).json({ error: "Appointment already cancelled" });
    }

    // 2️⃣ Update appointment
    await appointment.update(
      { status: "cancelled" },
      { transaction: t }
    );

    // 3️⃣ Free slot
    await Slot.update(
      { status: "Available" },
      { where: { id: appointment.slot_id }, transaction: t }
    );

    await t.commit();

    // 4️⃣ Fetch names WITHOUT lock
    const doctor = await Doctor.findByPk(appointment.doctor_id, {
      attributes: ["name"],
    });

    const clinic = await Clinic.findByPk(appointment.clinic_id, {
      attributes: ["name"],
    });

    const message = `Your appointment with Dr. ${doctor.name}
at ${appointment.appointment_time}
in ${clinic.name} has been cancelled.`;

    return res.json({ message });

  } catch (err) {
    await t.rollback();
    return res.status(500).json({ error: err.message });
  }
};


// reschedule Appointment
exports.rescheduleAppointment = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { new_slot_id } = req.body;

    // 1️⃣ Lock ONLY the appointment (NO include)
    const appointment = await Appointment.findByPk(id, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!appointment) {
      await t.rollback();
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (appointment.status === "cancelled") {
      await t.rollback();
      return res
        .status(400)
        .json({ error: "Cannot reschedule cancelled appointment" });
    }

    // 2️⃣ Lock old slot
    const oldSlot = await Slot.findByPk(appointment.slot_id, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!oldSlot) {
      await t.rollback();
      return res.status(404).json({ error: "Old slot not found" });
    }

    // 3️⃣ Lock new slot
    const newSlot = await Slot.findByPk(new_slot_id, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!newSlot || newSlot.status !== "Available") {
      await t.rollback();
      return res.status(400).json({ error: "New slot not available" });
    }

    // 4️⃣ Update appointment
    await appointment.update(
      {
        slot_id: new_slot_id,
        appointment_date: newSlot.date,
        appointment_time: newSlot.time,
        status: "rescheduled",
      },
      { transaction: t }
    );

    // 5️⃣ Update slots
    await oldSlot.update({ status: "Available" }, { transaction: t });
    await newSlot.update({ status: "Not Available" }, { transaction: t });

    await t.commit();

    // 6️⃣ Fetch doctor & clinic (NO LOCK, NO TRANSACTION)
    const doctor = await Doctor.findByPk(appointment.doctor_id, {
      attributes: ["name"],
    });

    const clinic = await Clinic.findByPk(appointment.clinic_id, {
      attributes: ["name"],
    });

    // 7️⃣ Build message
    const message = `Your appointment with Dr. ${doctor.name}
has been rescheduled to ${appointment.appointment_time}
in ${clinic.name}.`;

    return res.json({
      message,
      data: appointment,
    });

  } catch (err) {
    await t.rollback();
    return res.status(500).json({ error: err.message });
  }
};