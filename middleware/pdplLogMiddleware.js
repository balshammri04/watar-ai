// middleware/pdpllogMiddleware.js
const Log = require("../models/Log");

module.exports = (req, res, next) => {
  res.on("finish", async () => {
    try {
      await Log.create({
        user_id: req.user?.id || null,       
        action: req.method,                  
        endpoint: req.originalUrl,           
        status: res.statusCode < 400 ? "success" : "failed",
        ip: req.ip,
        details: JSON.stringify({
          body: req.body,
          query: req.query,
          params: req.params,
        }),
      });
    } catch (err) {
      console.error("❌ Error writing PDPL log:", err.message);
    }
  });

  next();
};
