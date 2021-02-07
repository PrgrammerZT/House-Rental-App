import { func } from "prop-types";

export function getToken() {
  return localStorage.getItem("hkzf_token");
}

export function setToken(token) {
  localStorage.setItem("hkzf_token", token);
}

export function removeToken(token) {
  localStorage.removeItem("hkzf_token");
}

export function isAuth() {
  //两个非是因为undefined 第一个！undefined可以转化为true 再！以下变成原来的
  return !!getToken();
}
