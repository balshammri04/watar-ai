// routes/dashboardRoutes.js
// for admin-only access to dashboard summary
const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "ADMIN_ONLY" });
  }
  next();
};

// GET /api/dashboard/summary
router.get(
  "/summary",
  authMiddleware,
  adminOnly,
  dashboardController.getDashboardSummary
);


module.exports = router;

