// src/api.js
import axios from "axios";

const baseURL =
    import.meta.env.MODE === "development"
        ? import.meta.env.VITE_API_URL_LOCAL
        : import.meta.env.VITE_API_URL_PROD;

console.log("Axios Base URL:", baseURL); // for confirmation

const api = axios.create({
    baseURL,
});

export default api;
