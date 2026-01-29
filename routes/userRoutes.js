// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Admin Only Middleware
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

// Create user (Admin only)
router.post("/", authMiddleware, adminOnly, userController.createUser);

// Get all users (Admin only)
router.get("/", authMiddleware, adminOnly, userController.getAllUsers);

// Delete user (Admin only)
router.delete("/:id", authMiddleware, adminOnly, userController.deleteUser);

module.exports = router;
