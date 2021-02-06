import React, { createRef } from "react";
import styles from "./index.module.css";
import PropTypes from "prop-types";
export default class Sticky extends React.PureComponent {
  placeholder = createRef();
  content = createRef();
  //监听浏览器的scroll事件
  handleScroll = () => {
    const placeholderEL = this.placeholder.current;
    const contentEL = this.content.current;
    // console.log(placeholder);
    // console.log(content);
    //有时候可能会报错 因为滑的太快了
    if (!placeholderEL || !contentEL) {
      return;
    }
    //dom对象的方法 DOM对象找到距离顶部的top值 和scroll被卷起的头部是不同的
    const rectObj = placeholderEL.getBoundingClientRect();
    if (rectObj.top <= 0) {
      contentEL.classList.add(styles.sticky);
      //占位 但是被z-index为1的覆盖
      //根据props传递过来height
      placeholderEL.style.height = this.props.height + "px";
      this.virtual_list.classList.remove(styles.pblist);
    } else {
      //不吸顶
      contentEL.classList.remove(styles.sticky);
      //占位 但是被z-index为1的覆盖
      placeholderEL.style.height = "0px";
      this.virtual_list.classList.add(styles.pblist);
    }
  };
  componentWillUnmount() {
    //卸载组件的时候 也应该恢复原样
    this.virtual_list.classList.remove(styles.pblist);
  }
  componentDidMount() {
    this.eventid = window.addEventListener("scroll", this.handleScroll);

    this.virtual_list = document.getElementsByClassName(
      "ReactVirtualized__List"
    )[0];

    //一开始没有scroll就要添加样式
    this.virtual_list.classList.add(styles.pblist);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.eventid);
  }

  render() {
    return (
      <div className="sticky">
        {/* 占位符 */}
        <div ref={this.placeholder}></div>
        {/* 内容元素 */}
        <div ref={this.content}>{this.props.children}</div>
      </div>
    );
  }
}

Sticky.propTypes = {
  height: PropTypes.number.isRequired,
};
