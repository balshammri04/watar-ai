// src/api/auth.js
import api from "./index";

export const loginApi = async (email, password) => {
  const res = await api.post("/auth/login", {
    email,
    password,
  });
  return res.data;
};
