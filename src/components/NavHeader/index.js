import React from "react";
import { NavBar } from "antd-mobile";
import { withRouter } from "react-router-dom";
import { PropTypes } from "prop-types";
function NavHeader(props) {
  const defaultHandler = () => props.history.go(-1);
  return (
    <NavBar
      className="navbar"
      mode="light"
      icon={<i className="iconfont icon-back" style={{ color: "#333" }}></i>}
      onLeftClick={props.onLeftClick || defaultHandler}
    >
      {props.children}
    </NavBar>
  );
}

NavHeader.propTypes = {
  children: PropTypes.string.isRequired,
  onLeftClick: PropTypes.func,
};

export default withRouter(NavHeader);
