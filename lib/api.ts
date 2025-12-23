// lib/api.ts
import axios from "axios";
const api = axios.create({ baseURL: "/api" });

// attach token if stored in cookie/localStorage (simple)
api.interceptors.request.use((cfg) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && cfg.headers) cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

export default api;
