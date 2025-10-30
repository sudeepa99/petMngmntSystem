import api from "./axios";

export const addPet = async (petData, token) => {
  const response = await api.post("/pets", petData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAllPets = async (token) => {
  const response = await api.get("/pets", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getPetById = async (petId, token) => {
  const response = await api.get(`/pets/${petId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updatePet = async (petId, petData, token) => {
  const response = await api.put(`/pets/${petId}`, petData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deletePet = async (petId, token) => {
  const response = await api.delete(`/pets/${petId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
