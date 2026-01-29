// const ehrService = require("../services/ehrService");

// // Clinics
// exports.getClinics = async (req, res) => {
//   try {
//     const { branch_id } = req.query;

//     const data = branch_id
//       ? await ehrService.getClinicsByBranch(branch_id)
//       : await ehrService.getClinics();

//     return res.json({
//       message: "Clinics fetched",
//       data
//     });

//   } catch (err) {
//     console.error("Error fetching clinics:", err);
//     return res.status(500).json({ error: err.message });
//   }
// };

// // Doctors
// exports.getDoctors = async (req, res) => {
//   try {
//     const { clinic_id } = req.query;

//     const data = clinic_id
//       ? await ehrService.getDoctorsByClinic(clinic_id)
//       : await ehrService.getDoctors();

//     return res.json({
//       message: "Doctors fetched",
//       data
//     });

//   } catch (err) {
//     console.error("Error fetching doctors:", err);
//     return res.status(500).json({ error: err.message });
//   }
// };

// // Slots
// exports.getSlots = async (req, res) => {
//   try {
//     const { doctor_id, clinic_id, date } = req.query;

//     if (!date) {
//       return res.status(400).json({
//         error: "DATE_REQUIRED",
//         message: "date query param is required (YYYY-MM-DD)"
//       });
//     }

//     let data;

//     if (doctor_id) data = await ehrService.getSlotsByDoctor(doctor_id, date);
//     else if (clinic_id) data = await ehrService.getSlotsByClinic(clinic_id, date);
//     else data = await ehrService.getSlots(date);

//     return res.json({
//       message: "Slots fetched",
//       data
//     });

//   } catch (err) {
//     console.error("Error fetching slots:", err);
//     return res.status(500).json({ error: err.message });
//   }
// };



const ehrService = require("../services/ehrService");

// Clinics
exports.getClinics = async (req, res) => {
  try {
    const { branch_id } = req.query;

    const data = branch_id
      ? await ehrService.getClinicsByBranch(branch_id)
      : await ehrService.getClinics();

    return res.json({
      message: "Clinics fetched",
      data
    });

  } catch (err) {
    console.error("Error fetching clinics:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Doctors
exports.getDoctors = async (req, res) => {
  try {
    const { clinic_id } = req.query;

    const data = clinic_id
      ? await ehrService.getDoctorsByClinic(clinic_id)
      : await ehrService.getDoctors();

    return res.json({
      message: "Doctors fetched",
      data
    });

  } catch (err) {
    console.error("Error fetching doctors:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Slots
exports.getSlots = async (req, res) => {
  try {
    const { doctor_id, clinic_id } = req.query;

    let data;

    if (doctor_id) data = await ehrService.getSlotsByDoctor(doctor_id);
    else if (clinic_id) data = await ehrService.getSlotsByClinic(clinic_id);
    else data = await ehrService.getSlots();

    return res.json({
      message: "Slots fetched",
      data
    });

  } catch (err) {
    console.error("Error fetching slots:", err);
    return res.status(500).json({ error: err.message });
  }
};