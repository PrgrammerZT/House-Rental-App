import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// 引入antd和ppfish 对比antd和ppfish的使用
import "antd-mobile/dist/antd-mobile.min.css";
//需要把自己写的样式放在他写的样式后面
import "./index.css";
//导入字体图标库
import "./assets/fonts/iconfont.css";

//导入React-vertualized的样式
import "react-virtualized/styles.css";

//导入NavHeader的样式
import "./components/NavHeader/index.css";
ReactDOM.render(<App />, document.getElementById("root"));
