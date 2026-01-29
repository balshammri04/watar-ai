// routes/logRoutes.js
const express = require("express");
const router = express.Router();
const Log = require("../models/Log");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/logs (Admin only)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const logs = await Log.findAll({
      order: [["createdAt", "DESC"]],
      include: ["User"],
    });

    res.json({ data: logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
