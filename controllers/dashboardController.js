// controllers/dashboardController.js 
// for admin dashboard summary data
const { Op } = require("sequelize");
const Call = require("../models/Call");
const User = require("../models/User");
const Log = require("../models/Log");

exports.getDashboardSummary = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // 📞 Calls
    const [totalCalls, todayCalls, successfulCalls, failedCalls] =
      await Promise.all([
        Call.count(),
        Call.count({
          where: { start_time: { [Op.gte]: todayStart } },
        }),
        Call.count({ where: { status: "completed" } }),
        Call.count({ where: { status: "failed" } }),
      ]);

    // ✅ Success Rate (لازم هنا)
    const successRate =
  totalCalls > 0
    ? Math.round((successfulCalls / totalCalls) * 100)
    : 0;


    // 👥 Users
    const [totalUsers, adminUsers, staffUsers] = await Promise.all([
      User.count(),
      User.count({ where: { role: "admin" } }),
      User.count({ where: { role: "staff" } }),
    ]);

    // ⚠️ System Health (last 15 minutes only)
    const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000);

    const lastError = await Log.findOne({
      where: {
        status: "failed",
        createdAt: { [Op.gte]: fifteenMinAgo },
      },
      order: [["createdAt", "DESC"]],
      attributes: ["createdAt"],
    });

    return res.json({
      calls: {
        total: totalCalls,
        today: todayCalls,
        successful: successfulCalls,
        failed: failedCalls,
        success_rate: successRate,
      },
      users: {
        total: totalUsers,
        admins: adminUsers,
        staff: staffUsers,
      },
      system: {
        status: lastError ? "warning" : "ok",
        last_error_at: lastError?.createdAt || null,
      },
    });
  } catch (err) {
    console.error("❌ Dashboard Summary Error:", err);
    return res.status(500).json({ error: "DASHBOARD_SUMMARY_FAILED" });
  }
};



// const { Op } = require("sequelize");
// const Call = require("../models/Call");
// const User = require("../models/User");
// const Log = require("../models/Log");

// exports.getDashboardSummary = async (req, res) => {
//   try {
//     const todayStart = new Date();
//     todayStart.setHours(0, 0, 0, 0);

//     // 📞 Calls
//     const [totalCalls, todayCalls, successfulCalls, failedCalls] =
//       await Promise.all([
//         Call.count(),
//         Call.count({
//           where: { start_time: { [Op.gte]: todayStart } },
//         }),
//         Call.count({ where: { status: "completed" } }),
//         Call.count({ where: { status: "failed" } }),
//       ]);

//     // 👥 Users
//     const [totalUsers, adminUsers, staffUsers] = await Promise.all([
//       User.count(),
//       User.count({ where: { role: "admin" } }),
//       User.count({ where: { role: "staff" } }),
//     ]);

//     // ⚠️ System Health
//     const lastError = await Log.findOne({
//       where: { status: "failed" },
//       order: [["createdAt", "DESC"]],
//       attributes: ["createdAt"],
//     });

//     return res.json({
//       calls: {
//         total: totalCalls,
//         today: todayCalls,
//         successful: successfulCalls,
//         failed: failedCalls,
//       },
//       users: {
//         total: totalUsers,
//         admins: adminUsers,
//         staff: staffUsers,
//       },
//       system: {
//         status: lastError ? "warning" : "ok",
//         last_error_at: lastError?.createdAt || null,
//       },
//     });
//   } catch (err) {
//     console.error("❌ Dashboard Summary Error:", err);
//     return res.status(500).json({ error: "DASHBOARD_SUMMARY_FAILED" });
//   }
// };
