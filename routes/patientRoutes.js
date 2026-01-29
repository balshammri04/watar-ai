const express = require("express");
const router = express.Router();

const { 
  createPatient, 
  getAllPatients,
  verifyPatient,
  verifyOrCreateByPhone,   // 🆕
  deletePatient 
} = require("../controllers/patientController");

const authMiddleware = require("../middleware/authMiddleware");

// Create patient (manual / admin)
router.post("/", createPatient);

// Get all patients (admin)
router.get("/", authMiddleware, getAllPatients);

// Verify patient (national_id OR phone)
router.get("/verify", verifyPatient);

// 🔥 Voice AI: verify OR create by phone
router.post("/voice/verify-or-create", verifyOrCreateByPhone);

// ✅ DELETE patient
router.delete("/:id", authMiddleware, deletePatient);

module.exports = router;
