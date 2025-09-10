// src/api/axiosInstance.js
import axios from "axios";

/**
 * Robust baseURL resolution:
 * - In dev (localhost) -> http://localhost:5000/api
 * - In prod (Vercel)   -> /api   (Vercel rewrites to your Render API)
 * - If VITE_API_BASE_URL is set, it wins.
 */
const pickBase = () => {
    const envBase = import.meta?.env?.VITE_API_BASE_URL;
    if (envBase && typeof envBase === "string" && envBase.trim()) {
        return envBase.replace(/\/+$/, ""); // trim trailing slashes
    }
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
        return "http://localhost:5000/api";
    }
    return "/api"; // works with vercel.json rewrites in prod
};

const baseURL = pickBase();


const api = axios.create({
    baseURL,
    timeout: 20000,
    // withCredentials: true, // enable only if you actually use cookies
});

/**
 * REQUEST NORMALIZER
 * If your call sites pass "api/..." (e.g., api.post("api/auth/login")),
 * this interceptor strips the leading "api/" so you don't get /api/api/...
 * It also ensures the URL starts with a single leading slash.
 */
api.interceptors.request.use((config) => {
    if (config?.url) {
        let u = String(config.url);
        // remove any leading slashes for inspection
        u = u.replace(/^\/+/, "");
        // strip leading "api/" if present
        if (u.startsWith("api/")) u = u.slice(3);
        // ensure exactly one leading slash in final URL
        config.url = "/" + u.replace(/^\/+/, "");
    }
    return config;
});

export default api;
