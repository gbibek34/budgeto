import axios from "axios";
import config from "../config"

const api = axios.create({
    baseURL: config.apiUrl, // change this to your backend URL
    headers: {
        "Content-Type": "application/json"
    },
    timeout: config.apiTimeout
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

export default api;
