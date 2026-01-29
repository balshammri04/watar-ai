const express = require("express");
const router = express.Router();
const ehrController = require("../controllers/ehrController");

router.get("/clinics", ehrController.getClinics);
router.get("/doctors", ehrController.getDoctors);
router.get("/slots", ehrController.getSlots);

module.exports = router;
