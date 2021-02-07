import React, { Component } from "react";
import { Flex, WingBlank, WhiteSpace, Toast } from "antd-mobile";
import { Link } from "react-router-dom";

import NavHeader from "../../components/NavHeader";

import styles from "./index.module.scss";
import request from "../../utils/request";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { setToken } from "../../utils/token";
// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/;
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/;
function Register(props) {
  return (
    <div className={styles.root}>
      {/* 顶部导航 */}
      <NavHeader className={styles.navHeader}>账号注册</NavHeader>

      {/* 登录表单 */}
      <WingBlank>
        <WhiteSpace size="xl"></WhiteSpace>
        {/* 使用了renderProps的方式去实现表单 */}
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={async (values, actions) => {
            // console.log(values, actions);
            const data = await request.post("/user/registered", values);
            if (data != null) {
              //成功了
              setToken(data.toke);
              props.history.push("/home/profile");
            } else {
              Toast.info("用户名已重复 请更换用户名重新注册");
            }
          }}
          validationSchema={Yup.object().shape({
            username: Yup.string()
              .required("用户名是必填项")
              .matches(REG_UNAME, "用户名必须在5-8位"),
            password: Yup.string()
              .required("密码是必填项")
              .matches(REG_PWD, "密码必须在5-12位"),
          })}
        >
          {() => {
            return (
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
                    注 册
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
        <div className={styles.backHome}>
          <Link to="/login">已有账号，去登录~</Link>
        </div>
      </WingBlank>
    </div>
  );
}

export default Register;
