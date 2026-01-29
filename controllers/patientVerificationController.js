// controllers/patientVerificationController.js

const Patient = require("../models/Patient");

exports.verifyPatient = async (req, res) => {
  try {
    const { national_id } = req.query;

    if (!national_id) {
      return res.status(400).json({
        message: "national_id is required",
      });
    }

    const patient = await Patient.findOne({
      where: { national_id }
    });

    if (!patient) {
      return res.status(404).json({
        verified: false,
        message: "Patient not found",
      });
    }

    return res.json({
      verified: true,
      message: "Patient verified successfully",
      patient: {
        id: patient.id,
        name: patient.name,
        phone: patient.phone,
        national_id: patient.national_id,
      }
    });

  } catch (err) {
    console.error("❌ Error verifying patient:", err.message);
    return res.status(500).json({ error: err.message });
  }
};
