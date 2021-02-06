import { Toast } from "antd-mobile";
import axios from "axios";
import BASE_URL from "./url";
const service = axios.create({
  baseURL: BASE_URL,
});

service.interceptors.request.use((config) => {
  Toast.loading("加载中...", 0, null, true);
  service.isLoading = true;
  return config;
});

service.interceptors.response.use((response) => {
  Toast.hide();
  service.isLoading = false;
  return Promise.resolve(response);
});

export default service;
