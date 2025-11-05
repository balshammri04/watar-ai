// ✅ WATAR AI Backend Server

const express = require("express");
const app = express();

console.log("✅ Starting WATAR AI backend server...");

app.get("/", (req, res) => {
  res.send("WATAR AI Backend Running ✅");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running successfully on port ${PORT}`);
});
