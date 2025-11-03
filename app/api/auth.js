import api from "./axios";

export const registerUser = async (userData) => {
  try {
    const res = await api.post("/auth/register", userData);
    return res.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error.response?.data || { message: "Registration Failed" };
  }
};

export const loginUser = async (credentials) => {
  try {
    const res = await api.post("/auth/login", credentials);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      localStorage.setItem("role", res.data.role);
    }
    return res.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error.response?.data || { message: "Login Failed" };
  }
};
