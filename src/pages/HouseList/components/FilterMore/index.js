import React, { Component } from "react";

import FilterFooter from "../../../../components/FilterFooter";

import styles from "./index.module.css";

export default class FilterMore extends Component {
  //在state中设置默认的defaultValue
  state = {
    selectedValue: this.props.defaultValue,
  };
  // 渲染标签
  renderFilters(data) {
    // 高亮类名： styles.tagActive
    return data.map((item) => {
      const { selectedValue } = this.state;
      const isClicked = selectedValue.indexOf(item.value) > -1;
      return (
        <span
          className={[styles.tag, isClicked ? styles.tagActive : ""].join(" ")}
          key={item.value}
          onClick={() => {
            this.onTagClick(item.value);
          }}
        >
          {item.label}
        </span>
      );
    });
  }

  //多个on-off的switch开关处理办法
  onTagClick = (value) => {
    const { selectedValue } = this.state;
    const newselectedValue = [...selectedValue];
    //没有当前项
    if (selectedValue.indexOf(value) == -1) {
      newselectedValue.push(value);
    } else {
      //有当前项 就删除数组中的这一项元素
      const index = newselectedValue.findIndex((item) => item === value);
      //splice的删除方法
      newselectedValue.splice(index, 1);
    }
    //更新状态
    this.setState({
      selectedValue: newselectedValue,
    });
  };

  //确定按钮的事件处理程序
  onOk = () => {
    //从props中取出内容
    const { type, onSave } = this.props;
    onSave(this.state.selectedValue, type);
  };

  render() {
    const { roomType, oriented, floor, characteristic } = this.props.data;
    const { onleave, type, changeSelected } = this.props;
    // console.log(onleave);
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div
          className={styles.mask}
          onClick={() => {
            onleave(type);
          }}
        />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          className={styles.footer}
          cancelText="清除"
          onCancel={async () => {
            let flag = true;
            //判断一下当前的selectedValue是否为空
            if (this.state.selectedValue.length === 0) {
              //其实不需要更新了,传回一个false;
              flag = false;
            }
            //把type写死 因为只有这一个 需要更改的是父组件内more的状态 否则没有用
            this.setState({ selectedValue: [] });
            ////...需要改变父级状态 否则高亮没有效果
            await changeSelected([]);

            //这里的onCancel的名字叫做onleave
            onleave(type, flag);
          }}
          onOk={this.onOk}
        />
      </div>
    );
  }
}
