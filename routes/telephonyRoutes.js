const express = require("express");
const router = express.Router();
const controller = require("../controllers/telephonyController");

// Inbound call
router.post("/inbound", controller.handleInboundCall);

// STT process
router.post("/process", controller.processSpeech);

// Call status
router.post("/status", controller.callStatus);

// Human handoff
router.post("/handoff", controller.handoffToHuman);

// Handoff failed 
router.post("/handoff-failed", controller.handoffFailed);

module.exports = router;
