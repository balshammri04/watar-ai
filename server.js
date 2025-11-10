// ✅ WATAR AI Backend Server

// 🧩 1. استدعاء المكتبات الأساسية
const express = require("express");
const sequelize = require("./config/database");

// ⚙️ 2. تفعيل Express
const app = express();
app.use(express.json());

console.log("Hello Bayan 👋");
console.log("✅ Starting WATAR AI backend server...");

// 🧠 3. تحميل النماذج (Models)
require("./models/Patient");
require("./models/Appointment");
require("./models/Call");

// 🌐 4. اختبار أول Route للتأكد أن السيرفر يعمل
app.get("/", (req, res) => {
  res.send("WATAR AI Backend Running ✅");
});

// 🔗 5. اختبار الاتصال بقاعدة البيانات
console.log("📡 Database file imported, starting connection test...");

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected successfully");
    return sequelize.sync({ alter: true }); // مزامنة الجداول مع التعديلات
  })
  .then(() => {
    console.log("✅ Database synced (tables ready)");

    // 🚀 تشغيل السيرفر بعد نجاح الاتصال
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log("⚙️ File executed successfully!");
      console.log(`🚀 Server running successfully on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection or sync failed:", err.message);
  });

// 📦 6. Placeholder for routes
// app.use('/api/patients', require('./routes/patientRoutes'));
