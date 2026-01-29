const Patient = require("../models/Patient");

/**
 * Create new patient (existing)
 */
exports.createPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);

    return res.status(201).json({
      message: "Patient created successfully",
      data: patient,
    });
  } catch (err) {
    console.error("❌ Error creating patient:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Get all patients (existing)
 */
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll();

    return res.json({
      message: "All patients fetched successfully",
      data: patients,
    });
  } catch (err) {
    console.error("❌ Error fetching patients:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Verify patient (existing, untouched)
 * ?phone= OR ?national_id=
 */
exports.verifyPatient = async (req, res) => {
  try {
    const { national_id, phone } = req.query;

    if (!national_id && !phone) {
      return res.status(400).json({
        verified: false,
        message: "Please provide national_id or phone",
      });
    }

    const whereCondition = {};
    if (national_id) whereCondition.national_id = national_id;
    if (phone) whereCondition.phone = phone;

    const patient = await Patient.findOne({ where: whereCondition });

    if (!patient) {
      return res.status(404).json({
        verified: false,
        message: "Patient not found",
      });
    }

    return res.json({
      verified: true,
      message: "Patient verified successfully",
      data: patient,
    });

  } catch (err) {
    console.error("❌ Error verifying patient:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * 🔥 Voice AI Flow
 * Verify patient by phone OR create if not exists
 */
exports.verifyOrCreateByPhone = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        message: "phone is required",
      });
    }

    let patient = await Patient.findOne({
      where: { phone }
    });

    // 🟢 موجود
    if (patient) {
      return res.json({
        status: "existing",
        patient: {
          id: patient.id,
          name: patient.name,
          phone: patient.phone
        }
      });
    }

    // 🟡 غير موجود → نسجّله
    patient = await Patient.create({
      phone,
      name: "مريض جديد"
    });

    return res.status(201).json({
      status: "created",
      patient: {
        id: patient.id,
        name: patient.name,
        phone: patient.phone
      }
    });

  } catch (err) {
    console.error("❌ Error verifyOrCreateByPhone:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

// 🗑️ Delete patient by ID
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByPk(id);

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    await patient.destroy();

    return res.json({
      message: "Patient deleted successfully",
    });

  } catch (err) {
    console.error("❌ Error deleting patient:", err.message);
    return res.status(500).json({ error: err.message });
  }
};
