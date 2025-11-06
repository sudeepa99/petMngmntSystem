import api from "./axios";

export const getAllUsers = async (token) => {
  try {
    const response = await api.get("/users/getAllUsers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error Fetching Users", error);
    throw error;
  }
};
