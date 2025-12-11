import axios from "axios";

export const BASE_URL = "http://192.168.1.7:9090";
// export const BASE_URL = "https://backend.gaurastra.com";
// export const BASE_URL = "https://192";

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;

export default axiosInstance;