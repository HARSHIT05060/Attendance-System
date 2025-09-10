// axiosInstance.js
import axios from "axios";

/**
 * Use env vars so dev uses localhost, prod uses your deployed API (HTTPS).
 * In Vercel, set VITE_API_BASE_URL to something like:
 *   https://api.smart-attendance.your-domain.com/api
 */
const baseURL =
    import.meta.env.VITE_API_BASE_URL ||
    (window?.location?.hostname === "localhost"
        ? "http://localhost:5000/api"
        : "/api"); // optional fallback if you set a proxy/rewrites

const api = axios.create({
    baseURL,
    timeout: 20000,
    // withCredentials: true, // enable if you use cookies/sessions
});

export default api;
