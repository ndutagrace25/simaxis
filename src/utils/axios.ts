import axios from "axios";

const axiosInstance = axios.create({
  // @ts-ignore
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use((request) => {
  console.log("Starting Request", request);
  return request;
});

axiosInstance.interceptors.response.use((response) => {
  console.log("Response:", response);
  return response;
});

export default axiosInstance;
