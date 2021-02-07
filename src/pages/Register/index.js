import React, { Component } from "react";
import { Flex, WingBlank, WhiteSpace, Toast } from "antd-mobile";
import { Link } from "react-router-dom";

import NavHeader from "../../components/NavHeader";

import styles from "./index.module.scss";
import request from "../../utils/request";
import { ErrorMessage, Field, Form, withFormik } from "formik";
import * as Yup from "yup";
// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/;
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/;
function Register() {
  return (
    <div className={styles.root}>
      {/* 顶部导航 */}
      <NavHeader className={styles.navHeader}>账号登录</NavHeader>
      <WhiteSpace size="xl" />

      {/* 登录表单 */}
      <WingBlank>
        <Form>
          <div className={styles.formItem}>
            <Field
              name="username"
              className={styles.input}
              placeholder="请输入账号"
              type="text"
            ></Field>
          </div>
          <ErrorMessage
            name="username"
            className={styles.error}
            component="div"
          ></ErrorMessage>
          <div className={styles.formItem}>
            <Field
              name="password"
              type="password"
              placeholder="请输入密码"
              className={styles.input}
            />
          </div>
          <ErrorMessage
            name="password"
            className={styles.error}
            component="div"
          ></ErrorMessage>
          <div className={styles.formSubmit}>
            <button className={styles.submit} type="submit">
              登 录
            </button>
          </div>
        </Form>
        <div className={styles.backHome}>
          <Link to="/register">还没有账号，去注册~</Link>
        </div>
      </WingBlank>
    </div>
  );
}

export default Register;
