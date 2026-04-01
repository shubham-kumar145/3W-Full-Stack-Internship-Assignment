import api from "./api";

export const signupService = async (data) => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};

export const loginService = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const getMeService = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};