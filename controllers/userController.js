// controllers/userController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");

/* =========================
   👤 Create Staff User (Admin)
========================= */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email, password required"
      });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
console.log("CREATE USER PAYLOAD:", {
  name,
  email,
  username: email,
  role,
});

    const newUser = await User.create({
      name,
      email,
      username: email,        // ✅ الحل هنا
      password: hashedPassword,
      role: role || "staff",  // admin أو staff
    });

    return res.status(201).json({
      message: "User created successfully",
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (err) {
    console.error("Create User Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/* =========================
   📋 Get All Users (Admin)
========================= */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    console.error("Get Users Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

/* =========================
   🗑 Delete User (Admin)
========================= */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // منع حذف الأدمن
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin user" });
    }

    await User.destroy({ where: { id } });

    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete User Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
