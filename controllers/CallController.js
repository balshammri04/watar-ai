// controllers/CallController.js
require("dotenv").config();

const Call = require("../models/Call");
const Patient = require("../models/Patient");
const User = require("../models/User");

const CLINIC_NUMBER = process.env.TWILIO_PHONE_NUMBER;

/* ======================
   Helpers
====================== */
function safeParseTranscript(raw) {
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/* ======================
   START CALL
====================== */
exports.startCall = async (req, res) => {
  try {
    const { call_sid, caller_number } = req.body;

    if (!call_sid) {
      return res.status(400).json({ error: "call_sid is required" });
    }

    await Call.findOrCreate({
      where: { call_sid },
      defaults: {
        caller_number,
        start_time: new Date(), // 👈 هنا الأساس
        status: "in_progress",
        direction: caller_number === CLINIC_NUMBER ? "outbound" : "inbound",
      },
    });

    return res.json({ message: "Call started" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


/* ======================
   APPEND TRANSCRIPT
====================== */
exports.appendTranscript = async (req, res) => {
  res.json({ message: "appendTranscript ok" });
};

/* ======================
   UPDATE INTENT
====================== */
exports.updateIntent = async (req, res) => {
  res.json({ message: "updateIntent ok" });
};

/* ======================
   ⛔ End Call (REAL)
====================== */
exports.endCall = async (req, res) => {
  try {
    const { call_sid } = req.body;

    const call = await Call.findOne({ where: { call_sid } });
    if (!call) return res.status(404).json({ error: "Call not found" });

    const endTime = new Date();
    const duration = call.start_time
      ? Math.floor((endTime - new Date(call.start_time)) / 1000)
      : null;

    call.end_time = endTime;
    call.duration_seconds = duration;
    call.status = "completed";

    await call.save();

    return res.json({ message: "Call ended", duration });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


/* ======================
   GET ALL CALLS
====================== */
exports.getAllCalls = async (req, res) => {
  try {
    const calls = await Call.findAll({
      include: [
        { model: Patient, as: "patient" },
        { model: User, as: "agent" },
      ],
      order: [["start_time", "DESC"]],
    });

    const formatted = calls.map(call => ({
      id: call.id,
      call_sid: call.call_sid,
      // time: call.start_time,
      start_time: call.start_time,          
      caller_number: call.caller_number,    
      from_number: call.caller_number,
      to_number: CLINIC_NUMBER,
      direction: call.direction,
      status: call.status,
      duration_seconds: call.duration_seconds,
      transcript: safeParseTranscript(call.transcript),
    }));

    res.json({ data: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================
   GET CALL BY ID
====================== */
exports.getCallById = async (req, res) => {
  res.json({ message: "getCallById ok" });
};





// require("dotenv").config();

// const Call = require("../models/Call");
// const Patient = require("../models/Patient");
// const User = require("../models/User");

// const CLINIC_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// /* ==================================================
//    🧠 Safe Transcript Parser (OLD + NEW SUPPORT)
// ================================================== */
// function safeParseTranscript(raw) {
//   if (!raw) return [];

//   // ✅ JSON format (new)
//   if (raw.trim().startsWith("[")) {
//     try {
//       return JSON.parse(raw);
//     } catch {
//       return [];
//     }
//   }

//   // ✅ Legacy text format (old)
//   return raw
//     .split("\n")
//     .filter(Boolean)
//     .map(line => {
//       const match = line.match(/\] (\w+): (.*)/);
//       if (!match) return null;

//       return {
//         role: match[1].toLowerCase(),
//         text: match[2],
//       };
//     })
//     .filter(Boolean);
// }

// /* ======================
//    📞 Start Call
// ====================== */
// exports.startCall = async (req, res) => {
//   try {
//     const { call_sid, patient_id, caller_number } = req.body;

//     if (!call_sid) {
//       return res.status(400).json({ error: "call_sid is required" });
//     }

//     const [call, created] = await Call.findOrCreate({
//       where: { call_sid },
//       defaults: {
//         patient_id: patient_id || null,
//         caller_number: caller_number || null,
//         start_time: new Date(),
//         status: "in_progress",
//         transcript: "",
//         intent: null,
//       },
//     });

//     return res.json({
//       message: created ? "Call started" : "Call already exists",
//       data: call,
//     });

//   } catch (err) {
//     console.error("❌ startCall:", err.message);
//     return res.status(500).json({ error: err.message });
//   }
// };

// /* ======================
//    🧾 Append Transcript
//    (JSON + Backward Safe)
// ====================== */
// exports.appendTranscript = async (req, res) => {
//   try {
//     const { call_sid, role, text } = req.body;

//     if (!call_sid || !role || !text) {
//       return res.status(400).json({
//         error: "call_sid, role, and text are required",
//       });
//     }

//     const call = await Call.findOne({ where: { call_sid } });
//     if (!call) {
//       return res.status(404).json({ error: "Call not found" });
//     }

//     const entry = {
//       role: role.toLowerCase(),
//       text,
//       time: new Date().toISOString(),
//     };

//     let history = [];

//     try {
//       history = call.transcript ? JSON.parse(call.transcript) : [];
//     } catch {
//       history = safeParseTranscript(call.transcript);
//     }

//     history.push(entry);

//     call.transcript = JSON.stringify(history);
//     await call.save();

//     return res.json({ message: "Transcript appended" });

//   } catch (err) {
//     console.error("❌ appendTranscript:", err.message);
//     return res.status(500).json({ error: err.message });
//   }
// };

// /* ======================
//    🧠 Update Intent
// ====================== */
// exports.updateIntent = async (req, res) => {
//   try {
//     const { call_sid, intent } = req.body;

//     if (!call_sid || !intent) {
//       return res.status(400).json({
//         error: "call_sid and intent are required",
//       });
//     }

//     const [updated] = await Call.update(
//       { intent },
//       { where: { call_sid } }
//     );

//     if (!updated) {
//       return res.status(404).json({ error: "Call not found" });
//     }

//     return res.json({ message: "Intent updated" });

//   } catch (err) {
//     console.error("❌ updateIntent:", err.message);
//     return res.status(500).json({ error: err.message });
//   }
// };

// /* ======================
//    ⛔ End Call
// ====================== */
// exports.endCall = async (req, res) => {
//   try {
//     const { call_sid } = req.body;

//     if (!call_sid) {
//       return res.status(400).json({ error: "call_sid is required" });
//     }

//     const call = await Call.findOne({ where: { call_sid } });
//     if (!call) {
//       return res.status(404).json({ error: "Call not found" });
//     }

//     const endTime = new Date();
//     const duration =
//       call.start_time
//         ? Math.floor((endTime - new Date(call.start_time)) / 1000)
//         : null;

//     call.end_time = endTime;
//     call.duration_seconds = duration;
//     call.status = "completed";

//     await call.save();

//     return res.json({ message: "Call ended" });

//   } catch (err) {
//     console.error("❌ endCall:", err.message);
//     return res.status(500).json({ error: err.message });
//   }
// };

// /* ======================
//    📊 Get All Calls
//    (Admin / Agent RBAC)
// ====================== */
// exports.getAllCalls = async (req, res) => {
//   try {
//     const { role, id } = req.user;

//     const where = {};
//     if (role === "user") {
//       where.agent_id = id;
//     }

//     const calls = await Call.findAll({
//       where,
//       include: [
//         {
//           model: Patient,
//           as: "patient",
//           attributes: ["id", "name", "phone"],
//         },
//         {
//           model: User,
//           as: "agent",
//           attributes: ["id", "name", "email"],
//         },
//       ],
//       order: [["start_time", "DESC"]],
//     });

//     const formatted = calls.map(call => {
//   // =========================
//   // 🧠 Status Display Logic
//   // =========================
//   let statusDisplay = "جارية";

//   if (call.status === "completed") {
//     if (call.outcome === "handoff") {
//       statusDisplay = "تم التحويل";
//     } else if (call.intent) {
//       statusDisplay = "نجحت";
//     } else {
//       statusDisplay = "لم تنجح";
//     }
//   }

//   return {
//     id: call.id,
//     call_sid: call.call_sid,

//     time: call.start_time,

//     from_number: call.caller_number,
//     to_number: CLINIC_NUMBER,

//     direction: call.direction,
//     call_type: call.call_type,

//     status: call.status,              // تقني (خليه)
//     status_display: statusDisplay,    // 👈 هذا اللي يستخدمه الـ UI

//     duration: call.duration_seconds,
//     transcript: safeParseTranscript(call.transcript),

//     patient: call.patient,
//     agent: call.agent,
//   };
// });

//     return res.json({ data: formatted });

//   } catch (err) {
//     console.error("❌ getAllCalls:", err.message);
//     return res.status(500).json({ error: err.message });
//   }
// };


// exports.getCallById = async (req, res) => {
//   try {
//     const call = await Call.findByPk(req.params.id, {
//       include: [
//         { model: Patient, as: "patient" },
//         { model: User, as: "agent" },
//       ],
//     });

//     if (!call) {
//       return res.status(404).json({ error: "Call not found" });
//     }

//     return res.json({
//       id: call.id,
//       time: call.start_time,
//       duration: call.duration_seconds,
//       status: call.status,
//       status_display:
//         call.outcome === "handoff"
//           ? "تم التحويل"
//           : call.intent
//           ? "نجحت"
//           : "لم تنجح",

//       transcript: safeParseTranscript(call.transcript),
//       intent: call.intent,
//       patient: call.patient,
//       agent: call.agent,
//     });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };
