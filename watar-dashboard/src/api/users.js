// src/api/users.js
import api from "./index";

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data.data;
};

export const createUser = async (payload) => {
  const res = await api.post("/users", payload);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};
