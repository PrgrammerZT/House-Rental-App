import { Toast } from "antd-mobile";
import axios from "axios";
import { getToken } from "./token";
import BASE_URL from "./url";
const service = axios.create({
  baseURL: BASE_URL,
});

service.interceptors.request.use((config) => {
  Toast.loading("加载中...", 0, null, true);
  service.isLoading = true;
  // config.headers["authorization"] = getToken() || "";
  return config;
});

service.interceptors.response.use((response) => {
  service.isLoading = false;
  Toast.hide();

  return Promise.resolve(response.data.body);
});

export default service;
