const express = require("express");
const router = express.Router();

const {
  createClinicConfig,
  getAllClinicConfigs,
  updateClinicConfig,
} = require("../controllers/clinicConfigController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createClinicConfig);
router.get("/", authMiddleware, getAllClinicConfigs);
router.put("/:id", authMiddleware, updateClinicConfig);

module.exports = router;
