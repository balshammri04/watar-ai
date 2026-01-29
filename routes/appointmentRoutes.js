// routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/AppointmentController");

// Get all appointments
router.get("/", appointmentController.getAllAppointments);

// Get available slots
router.get("/slots/available", appointmentController.getAvailableSlots);

// Get cancellable appointments
router.get("/cancellable", appointmentController.getCancellableAppointments);

// Create appointment
router.post("/", appointmentController.createAppointment);

// Cancel appointment
router.put("/:id/cancel", appointmentController.cancelAppointment);

// Reschedule appointment
router.put("/:id/reschedule", appointmentController.rescheduleAppointment);

module.exports = router;
