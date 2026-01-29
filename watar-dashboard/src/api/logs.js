// src/api/logs.js
import api from "./index";

export const getLogs = async () => {
  const res = await api.get("/logs");
  return res.data.data;
};
