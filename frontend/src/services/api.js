
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const checkBackendHealth = async () => {
  const response = await api.get("/api/health");
  return response.data;
};

export default api;
