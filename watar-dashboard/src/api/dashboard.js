// src/api/dashboard.js
import api from "./index";

export const getDashboardSummary = async () => {
  const res = await api.get("/dashboard/summary");
  return res.data;
};
