// services/rasaService.js
const axios = require("axios");

const RASA_URL = process.env.RASA_URL;

exports.sendToRasa = async (message, sessionId) => {
  try {
    const response = await axios.post(RASA_URL, {
      sender: sessionId,
      message
    });
    return response.data;
  } catch (err) {
    console.error("❌ Rasa Error:", err.message);
    return [];
  }
};
