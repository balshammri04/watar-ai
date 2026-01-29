//api/calls.js
import api from "./index";

export const getCalls = async () => {
  const res = await api.get("/calls");
  return res.data.data; 
};
