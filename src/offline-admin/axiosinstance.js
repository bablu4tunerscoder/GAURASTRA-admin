import axios from "axios";

// export const BASE_URL = "http://localhost:9090";
// export const BASE_URL = "https://backend.gaurastra.com";
export const BASE_URL = "https://offlinedev.gaurastra.com";

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;

export default axiosInstance;