import React from "react";
import { Flex } from "antd-mobile";
import "./index.css";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
function SearchHeader(props) {
  const classStyle = props.className || "";
  const iconColor = props.iconColor || "#fff";
  return (
    <Flex className={["search-box", classStyle].join(" ")}>
      {/* 左侧白色区域 */}
      <Flex className="search">
        {/* 位置 */}
        <div
          className="location"
          onClick={() => {
            props.history.push("/CityList");
          }}
        >
          <span className="name">{props.city}</span>
          <i className="iconfont icon-arrow" />
        </div>

        {/* 搜索表单 */}
        <div
          className="form"
          onClick={() => {
            props.history.push("/search");
          }}
        >
          <i className="iconfont icon-seach" />
          <span className="text">请输入小区或地址</span>
        </div>
      </Flex>
      {/* 右侧地图图标 */}
      <i
        className="iconfont icon-map"
        style={{ color: iconColor }}
        onClick={() => {
          props.history.push("/map");
        }}
      />
    </Flex>
  );
}

SearchHeader.propTypes = {
  city: PropTypes.string.isRequired,
  className: PropTypes.string,
  iconColor: PropTypes.string,
};

export default withRouter(SearchHeader);
