// src/api/axiosInstance.js
import axios from "axios";

/**
 * Keep baseURL ending at /api
 * Then call endpoints WITHOUT the 'api/' segment.
 */
const apiBase =
    import.meta.env.VITE_API_BASE_URL ||
    (window?.location?.hostname === "localhost"
        ? "http://localhost:5000/api"
        : "/api");

const api = axios.create({
    baseURL: apiBase,
    timeout: 20000,
    // withCredentials: true, // enable only if you actually use cookies
});

export default api;
