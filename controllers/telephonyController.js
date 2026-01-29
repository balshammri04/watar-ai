// controllers/telephonyController.js
const twilio = require("twilio");
const axios = require("axios");
const { VoiceResponse } = twilio.twiml;
const Patient = require("../models/Patient");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// 🧠 In-memory call context
const callContext = new Map();

/* =============================
   📞 Inbound Call
============================= */
exports.handleInboundCall = async (req, res) => {
  const vr = new VoiceResponse();
  const callerNumber = req.body?.From;
  const callSid = req.body?.CallSid;

  console.log(`[INBOUND] ${callSid} from ${callerNumber}`);

  let patient = null;
  if (callerNumber) {
    try {
      patient = await Patient.findOne({ where: { phone: callerNumber } });
    } catch (err) {
      console.error("[DB ERROR]", err.message);
    }
  }

  if (callSid) {
    callContext.set(callSid, {
      phone: callerNumber || null,
      patient_id: patient?.id || null,
      patient_name: patient?.name || null,
      is_known_patient: Boolean(patient),
      handoffTriggered: false
    });
  }

  if (callSid) {
    axios.post("http://localhost:3000/api/calls/start", {
      call_sid: callSid,
      caller_number: callerNumber,
      patient_id: patient?.id || null
    }).catch(() => {});
  }

  vr.say(
    { language: "ar-XA", voice: "Google.ar-XA-Chirp3-HD-Leda" },
    patient
      ? `أهلاً ${patient.name}، كيف أقدر أخدمك؟`
      : "أهلاً بك في عيادة مراس. كيف أقدر أخدمك؟"
  );

  vr.gather({
    input: "speech dtmf",
    language: "ar-SA",
    action: "/telephony/voice/process",
    method: "POST",
    speechTimeout: "auto",
    timeout: 10
  });

  res.type("text/xml").send(vr.toString());
};

/* =============================
   🧠 Process Speech
============================= */
exports.processSpeech = async (req, res) => {
  const vr = new VoiceResponse();
  const text = req.body?.SpeechResult;
  const callSid = req.body?.CallSid;

  console.log(`[STT] "${text || "EMPTY"}"`);

  if (!text) {
    vr.say(
      { language: "ar-XA", voice: "Google.ar-XA-Chirp3-HD-Leda" },
      "ما سمعتك زين، ممكن تعيد؟"
    );
    vr.redirect("/telephony/voice/inbound");
    return res.type("text/xml").send(vr.toString());
  }

  try {
    const context = callContext.get(callSid) || {};

    const rasaRes = await axios.post(process.env.RASA_URL, {
      sender: callSid,
      message: text,
      metadata: {
        call_sid: callSid,
        phone: context.phone,
        patient_id: context.patient_id,
        patient_name: context.patient_name,
        is_known_patient: !!context.is_known_patient
      }
    });

    const reply = rasaRes.data?.[0]?.text || "ممكن توضح أكثر؟";
    const intent = rasaRes.data?.[0]?.intent?.name || "none";
// 🧠 Save USER speech
axios.post("http://localhost:3000/api/calls/transcript", {
  call_sid: callSid,
  role: "user",
  text
}).catch(() => {});

// 🧠 Save AI reply  ←←← هذا كان ناقص
axios.post("http://localhost:3000/api/calls/transcript", {
  call_sid: callSid,
  role: "assistant",
  text: reply
}).catch(() => {});

    console.log(`[RASA] intent=${intent}`);
    console.log(`[RASA REPLY] "${reply}"`);




    /* =============================
       🤝 Human Handoff
    ============================= */
    if (intent === "handoff") {
      const waitVr = new VoiceResponse();

  await Call.update(
    { handoff: true },
    { where: { call_sid: callSid } }
  );
      if (!context.handoffTriggered) {
        context.handoffTriggered = true;
        callContext.set(callSid, context);

        axios.post(
          `${process.env.PUBLIC_BASE_URL}/telephony/voice/handoff`,
          {
            call_sid: callSid,
            caller_number: context.phone,
            to: process.env.AGENT_PHONE,
            reason: "user_requested_human"
          }
        ).catch(() => {});
      }

      waitVr.say(
        { language: "ar-XA", voice: "Google.ar-XA-Chirp3-HD-Leda" },
        "لحظة من فضلك، جاري تحويل المكالمة."
      );

      waitVr.pause({ length: 10 });
      return res.type("text/xml").send(waitVr.toString());
    }

    /* ===== Normal reply ===== */
    vr.say(
      { language: "ar-XA", voice: "Google.ar-XA-Chirp3-HD-Leda" },
      reply
    );

    vr.gather({
      input: "speech dtmf",
      language: "ar-SA",
      action: "/telephony/voice/process",
      method: "POST",
      speechTimeout: "auto",
      timeout: 10
    });

    res.type("text/xml").send(vr.toString());

  } catch (err) {
    console.error("[ERROR]", err.message);

    vr.say(
      { language: "ar-XA", voice: "Google.ar-XA-Chirp3-HD-Leda" },
      "صار خطأ تقني، نعيد المحاولة."
    );

    vr.gather({
      input: "speech dtmf",
      language: "ar-SA",
      action: "/telephony/voice/process",
      method: "POST",
      speechTimeout: "auto",
      timeout: 10
    });

    res.type("text/xml").send(vr.toString());
  }
};

/* =============================
   🤝 Handoff (REST)
============================= */
exports.handoffToHuman = async (req, res) => {
  try {
    const { call_sid, to } = req.body;

    const vr = new VoiceResponse();

    vr.say(
      { language: "ar-XA", voice: "Google.ar-XA-Chirp3-HD-Leda" },
      "لحظة من فضلك، يتم الآن تحويلك إلى موظف مختص."
    );

    const dial = vr.dial({
      callerId: process.env.TWILIO_PHONE_NUMBER,
      timeout: 20,
      action: "/telephony/voice/handoff-failed",
      method: "POST"
    });

    dial.number(to || process.env.AGENT_PHONE);

    await client.calls(call_sid).update({
      twiml: vr.toString()
    });

    res.json({ success: true });

  } catch (err) {
    console.error("[HANDOFF ERROR]", err.message);
    res.status(500).json({ success: false });
  }
};

/* =============================
   ❌ Handoff Failed
============================= */
exports.handoffFailed = (req, res) => {
  const vr = new VoiceResponse();

  vr.say(
    { language: "ar-XA", voice: "Google.ar-XA-Chirp3-HD-Leda" },
    "حالياً جميع الموظفين مشغولين، حاول مرة أخرى لاحقاً."
  );

  vr.hangup();
  res.type("text/xml").send(vr.toString());
};

/* =============================
   📞 Call Status Callback
============================= */
// exports.callStatus = async (req, res) => {
//   const callSid = req.body?.CallSid;
//   const status = req.body?.CallStatus;

//   console.log(`[CALL END] ${status}`);

//   if (status === "completed" && callSid) {
//     axios.post("http://localhost:3000/api/calls/end", {
//       call_sid: callSid
//     }).catch(() => {});

//     callContext.delete(callSid);
//   }

//   res.sendStatus(200);
// };

/* =============================
   📞 Call Status Callback
============================= */
exports.callStatus = async (req, res) => {
  try {
    const callSid = req.body?.CallSid;
    const status = req.body?.CallStatus; // ringing | in-progress | completed
    const direction = req.body?.Direction;
    const from = req.body?.From;
    const duration = req.body?.CallDuration; // seconds (string)

    console.log(`[CALL STATUS] ${callSid} → ${status}`);

    if (!callSid) return res.sendStatus(200);

    // 🔥 لما المكالمة تبدأ فعليًا
    if (status === "in-progress") {
      await Call.findOrCreate({
        where: { call_sid: callSid },
        defaults: {
          caller_number: from,
          start_time: new Date(),     // ⏱ وقت Twilio الحقيقي
          direction,
          status: "in_progress",
        },
      });
    }

    // 🔥 لما المكالمة تنتهي
    if (status === "completed") {
      await Call.update(
        {
          status: "completed",
          end_time: new Date(),
          duration_seconds: Number(duration) || 0, // ⏱ من Twilio
        },
        { where: { call_sid: callSid } }
      );

      callContext.delete(callSid);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("[CALL STATUS ERROR]", err.message);
    res.sendStatus(200); // Twilio ما يحب 500
  }
};



// const twilio = require("twilio");
// const axios = require("axios");
// const { VoiceResponse } = twilio.twiml;
// const Patient = require("../models/Patient");

// // ✅ Twilio REST Client (ضروري للتحويل أثناء المكالمة النشطة)
// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// // 🧠 In-memory call context (per CallSid)
// const callContext = new Map();

// /* =============================
//    📞 Inbound Call
// ============================= */
// exports.handleInboundCall = async (req, res) => {
//   const vr = new VoiceResponse();
//   const callerNumber = req.body?.From;
//   const callSid = req.body?.CallSid;

//   console.log(`[INBOUND] ${callSid} from ${callerNumber}`);

//   /* ===== DB lookup ===== */
//   let patient = null;
//   if (callerNumber) {
//     try {
//       patient = await Patient.findOne({ where: { phone: callerNumber } });
//       console.log(patient ? `[DB] HIT patient_id=${patient.id}` : `[DB] MISS`);
//     } catch (err) {
//       console.error(`[DB] ERROR`, err.message);
//     }
//   }

//   /* ===== Save context ===== */
//   if (callSid) {
//     callContext.set(callSid, {
//       phone: callerNumber || null,
//       patient_id: patient?.id || null,
//       patient_name: patient?.name || null,
//       is_known_patient: Boolean(patient),
//       handoffTriggered: false
//     });

//     console.log(`[Context] saved | known=${Boolean(patient)}`);
//   }

//   /* ===== Log call start (fire & forget) ===== */
//   if (callSid) {
//     axios.post("http://localhost:3000/api/calls/start", {
//       call_sid: callSid,
//       caller_number: callerNumber,
//       patient_id: patient?.id || null
//     }).catch(() => {});
//   }

//   /* ===== Greeting ===== */
//   vr.say(
//     { language: "ar-XA", voice: "Google.ar-XA-Chirp3-HD-Leda" },
//     patient
//       ? `أهلاً ${patient.name}، كيف أقدر أخدمك؟`
//       : "أهلاً بك في عيادة مراس. كيف أقدر أخدمك؟"
//   );

//   vr.gather({
//     input: "speech dtmf",
//     language: "ar-SA",
//     action: "/telephony/voice/process",
//     method: "POST",
//     speechTimeout: "auto"
//   });

//   res.type("text/xml").send(vr.toString());
// };

// /* =============================
//    🧠 Process Speech (STT → Rasa)
// ============================= */
// exports.processSpeech = async (req, res) => {
//   const vr = new VoiceResponse();
//   const text = req.body?.SpeechResult;
//   const confidence = req.body?.Confidence;
//   const callSid = req.body?.CallSid;

//   console.log(`[STT] "${text || "EMPTY"}" conf=${confidence}`);

//   if (!text) {
//     vr.say(
//       { language: "ar-XA", voice: "Google.ar-XA-Chirp3-HD-Leda" },
//       "ما سمعتك زين، ممكن تعيد؟"
//     );
//     vr.redirect("/telephony/voice/inbound");
//     return res.type("text/xml").send(vr.toString());
//   }

//   try {
//     const context = callContext.get(callSid) || {};
//     console.log(`[Context] loaded | patient_id=${context.patient_id || "null"}`);

//     /* ===== Send to Rasa ===== */
//     const payload = {
//       sender: callSid,
//       message: text,
//       metadata: {
//         call_sid: callSid,
//         phone: context.phone,
//         patient_id: context.patient_id,
//         patient_name: context.patient_name,
//         is_known_patient: !!context.is_known_patient
//       }
//     };

//     const rasaRes = await axios.post(process.env.RASA_URL, payload);
//     const reply = rasaRes.data?.[0]?.text || "ممكن توضح أكثر؟";
//     const intent = rasaRes.data?.[0]?.intent?.name || "none";

//     console.log(`[RASA] intent=${intent} | reply="${reply}"`);

//     /* ===== Log transcript ===== */
//     axios.post("http://localhost:3000/api/calls/transcript", {
//       call_sid: callSid,
//       text
//     }).catch(() => {});

//     /* =============================
//        🤝 Human Handoff (CORRECT)
//     ============================= */
//     if (intent === "handoff") {
//       if (context.handoffTriggered) {
//         console.log("[HANDOFF] already triggered, skipping");
//         return res.sendStatus(200);
//       }

//       context.handoffTriggered = true;
//       callContext.set(callSid, context);

//       console.log("[HANDOFF] triggering REST handoff");

//       await axios.post(
//         `${process.env.PUBLIC_BASE_URL}/telephony/voice/handoff`,
//         {
//           call_sid: callSid,
//           caller_number: context.phone,
//           to: process.env.AGENT_PHONE,
//           reason: "user_requested_human"
//         }
//       );

//       return res.sendStatus(200);
//     }

//     /* ===== Normal reply ===== */
//     vr.say(
//       { language: "ar-XA", voice: "Google.ar-XA-Chirp3-HD-Leda" },
//       reply
//     );

//     vr.gather({
//       input: "speech dtmf",
//       language: "ar-SA",
//       action: "/telephony/voice/process",
//       method: "POST",
//       speechTimeout: "auto"
//     });

//     res.type("text/xml").send(vr.toString());

//   } catch (err) {
//     console.error(`[ERROR]`, err.message);

//     vr.say(
//       { language: "ar-XA", voice: "Google.ar-XA-Chirp3-HD-Leda" },
//       "صار خطأ تقني، بحولك الآن لموظف مختص."
//     );

//     res.type("text/xml").send(vr.toString());
//   }
// };

// /* =============================
//    🤝 Human Handoff (REST – FINAL)
// ============================= */
// exports.handoffToHuman = async (req, res) => {
//   try {
//     const { call_sid, caller_number, to, reason } = req.body;

//     if (!call_sid) {
//       return res.status(400).json({
//         success: false,
//         error: "call_sid is required"
//       });
//     }

//     console.log("[HANDOFF] Updating active call:", {
//       call_sid,
//       caller_number,
//       to
//     });

//     const vr = new VoiceResponse();

//     vr.say(
//       { language: "ar-XA", voice: "Google.ar-XA-Chirp3-HD-Leda" },
//       "لحظة من فضلك، يتم الآن تحويلك إلى موظف مختص."
//     );

//     const dial = vr.dial({
//       callerId: process.env.TWILIO_PHONE_NUMBER,
//       timeout: 20,
//       action: "/telephony/voice/handoff-failed",
//       method: "POST"
//     });

//     dial.number(to || process.env.AGENT_PHONE);

//     await client.calls(call_sid).update({
//       twiml: vr.toString()
//     });

//     res.json({
//       success: true,
//       message: "Call transferred successfully",
//       call_sid,
//       transferred_to: to || process.env.AGENT_PHONE
//     });

//   } catch (error) {
//     console.error("[HANDOFF ERROR]", error.message);

//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// /* =============================
//    ❌ Handoff Failed
// ============================= */
// exports.handoffFailed = (req, res) => {
//   const vr = new VoiceResponse();

//   console.error("[HANDOFF FAILED]", {
//     DialCallStatus: req.body?.DialCallStatus,
//     DialCallSid: req.body?.DialCallSid,
//     CallSid: req.body?.CallSid
//   });

//   vr.say(
//     { language: "ar-XA", voice: "Google.ar-XA-Chirp3-HD-Leda" },
//     "حالياً جميع الموظفين مشغولين، حاول مرة أخرى لاحقاً."
//   );

//   vr.hangup();
//   res.type("text/xml").send(vr.toString());
// };

// /* =============================
//    📞 Call Status Callback
// ============================= */
// exports.callStatus = async (req, res) => {
//   const callSid = req.body?.CallSid;
//   const status = req.body?.CallStatus;

//   console.log(`[END] status=${status}`);

//   if (status === "completed" && callSid) {
//     axios.post("http://localhost:3000/api/calls/end", {
//       call_sid: callSid
//     }).catch(() => {});

//     callContext.delete(callSid);
//     console.log(`[Context] cleared`);
//   }

//   res.sendStatus(200);
// };
