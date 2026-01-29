// routes/staffRoutes.js
const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");
const authMiddleware = require("../middleware/authMiddleware");

const staffOnly = (req, res, next) => {
  if (req.user?.role !== "staff") {
    return res.status(403).json({ message: "Access denied. Staff only." });
  }
  next();
};

// ✅ GET /api/staff/calls  (handoff only)
router.get("/calls", authMiddleware, staffOnly, staffController.getHandoffCalls);

// ✅ GET /api/staff/summary
router.get("/summary", authMiddleware, staffOnly, staffController.getStaffSummary);

module.exports = router;
