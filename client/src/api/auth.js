import instance from "./axios";

export const register = async (userData) => {
  const response = await instance.post("/auth/register", userData);
  return response;
};

export const loginUser = async (userData) => {
  const response = await instance.post("/auth/login", userData);
  localStorage.setItem("token", response.data.token);
  return response;
};
