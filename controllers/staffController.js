// controllers/staffController.js
// for staff dashboard data
const { Op } = require("sequelize");
const Call = require("../models/Call");
const Patient = require("../models/Patient");

exports.getHandoffCalls = async (req, res) => {
  const calls = await Call.findAll({
    where: { handoff: true },
    order: [["start_time", "DESC"]],
  });

  res.json({ data: calls });
};


exports.getStaffSummary = async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [handoffToday, bookedToday] = await Promise.all([
    Call.count({
      where: {
        handoff: true,
        start_time: { [Op.gte]: todayStart },
      },
    }),
    Call.count({
      where: {
        handoff: true,
        outcome: "booked",
        start_time: { [Op.gte]: todayStart },
      },
    }),
  ]);

  res.json({
    handoff_calls_today: handoffToday,
    booked_today: bookedToday,
  });
};
