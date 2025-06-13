/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from "axios";

// @ts-ignore
const isDevelopment = import.meta.env.VITE_NODE_ENV === "development";
// const isDevelopment = process.env.VITE_NODE_ENV === "development";

const axiosInstance = axios.create({
  // @ts-ignore
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // baseURL: process.env.VITE_NODE_ENV,
});

axiosInstance.interceptors.request.use((request) => {
  if (isDevelopment) {
    console.log("Starting Request", request);
  }
  //@ts-ignore
  // request.headers["X-Hide-Request"] = true;
  return request;
});

axiosInstance.interceptors.response.use((response) => {
  if (isDevelopment) {
    console.log("Response:", response);
  }

  return response;
});

export default axiosInstance;
