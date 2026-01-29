// WATAR AI Backend Server

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");

// Middleware
const pdplLogMiddleware = require("./middleware/pdplLogMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const callRoutes = require("./routes/callRoutes");
const patientRoutes = require("./routes/patientRoutes");
const userRoutes = require("./routes/userRoutes");
const ehrRoutes = require("./routes/ehrRoutes");
const clinicConfigRoutes = require("./routes/clinicConfigRoutes");
const telephonyRoutes = require("./routes/telephonyRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const logRoutes = require("./routes/logRoutes");
const staffRoutes = require("./routes/staffRoutes");


const app = express();

/* ================== Core Middlewares ================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* ======================================================
   ✅ PDPL LOGGING (لازم يكون هنا قبل أي routes)
====================================================== */
app.use(pdplLogMiddleware);

/* ================== Routes ================== */
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/calls", callRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ehr", ehrRoutes);
app.use("/api/clinic-config", clinicConfigRoutes);
app.use("/telephony/voice", telephonyRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/staff", staffRoutes);

/* ================== Health Check ================== */
app.get("/", (_, res) => {
  res.send("WATAR AI Backend Running");
});

/* ================== Load Models (مهم قبل sync) ================== */
require("./models/Patient");
require("./models/Appointment");
require("./models/Call");
require("./models/User");
require("./models/Log");
require("./models/ClinicConfig");
require("./models/Clinic");
require("./models/Doctor");
require("./models/Slot");
require("./models/index");

/* ================== DB Init ================== */
const seedEhrDataIfNeeded = require("./seeders/seedEhrData");

sequelize
  .authenticate()
  .then(async () => {
    console.log("✅ DB authenticated");

    await sequelize.sync();
    console.log("✅ DB synced");

    await seedEhrDataIfNeeded();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB error:", err);
  });


// const seedEhrDataIfNeeded = require("./seeders/seedEhrData");

// // DB
// sequelize.authenticate()
//   .then(async () => {
//     console.log("✅ DB authenticated");

// await sequelize.sync();
//     console.log("✅ DB synced");

//     // 🔍 Check before seeding
//     const Clinic = require("./models/Clinic");
//     const clinicCount = await Clinic.count();

//     if (clinicCount === 0) {
//       console.log("🌱 Running EHR seed...");
//       await seedEhrData();
//       console.log("✅ EHR seed data inserted");
//     } else {
//       console.log("ℹ️ Seed skipped (data already exists)");
//     }


//     app.listen(process.env.PORT || 3000, () => {
//       console.log("🚀 Server running");
//     });
//   })
//   .catch(err => console.error("❌ DB error:", err));
