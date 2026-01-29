// controllers/logController.js
const Log = require("../models/Log");
const User = require("../models/User");

exports.getAllLogs = async (req, res) => {
  const logs = await Log.findAll({
    include: [{ model: User, attributes: ["email"] }],
    order: [["createdAt", "DESC"]],
  });

  res.json({ data: logs });
};
