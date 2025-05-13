// src/api.js

import axios from "axios";

// Create an Axios instance with base URL from environment variable
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export default api;
