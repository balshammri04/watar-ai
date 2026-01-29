//api/staff.js
import api from ".";

export const getStaffSummary = async () => {
  const res = await api.get("/staff/summary");
  return res.data;
};

export const getStaffCalls = async () => {
  const res = await api.get("/staff/calls");
  return res.data.data;
};
