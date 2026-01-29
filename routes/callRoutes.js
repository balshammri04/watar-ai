const express = require("express");
const router = express.Router();
const callController = require("../controllers/CallController");
const auth = require("../middleware/authMiddleware");

router.post("/start", callController.startCall);
router.post("/transcript", callController.appendTranscript);
router.post("/intent", callController.updateIntent);
router.post("/end", callController.endCall);

router.get("/", auth, callController.getAllCalls);
router.get("/:id", auth, callController.getCallById);

module.exports = router;

