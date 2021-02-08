import React, { Component } from "react";

import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";
import request from "../../../../utils/request";
import styles from "./index.module.css";
import { getCurrentCity } from "../../../../utils";
import { isEqual } from "lodash";
import { Spring } from "react-spring/renderprops";
import { withRouter } from "react-router-dom";
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false,
};

const defaultValues = {
  area: ["area", "null"],
  mode: ["null"],
  price: ["null"],
  more: [],
};
class Filter extends Component {
  state = {
    titleSelectedStatus,
    openType: "",
    filterObj: {},
    selectedValues: {},
  };
  //隐藏对话框
  onCancel = async (type, moreupdateflag) => {
    //Cancel的时候
    //type正确 但是要拿到selectedObj
    //逻辑 点了取消以后 我们要返回其上一次的状态 而不是和确定一样
    this.htmlbody.classList.remove("body-fixed");
    const { selectedValues } = this.state;
    let selectedObj = {};
    //点击取消和清除是不同的
    //取消指的是返回上一次的状态
    //清除指的是全都没了
    if (type === "more") {
      selectedObj = selectedValues[type];
      //数据没有变化并且两次都是0 意味着不用改变 反过来就是需要改变
      if (moreupdateflag) {
        //清除more数组
        const newselectedValues = { ...selectedValues, more: [] };
        await this.setState({ selectedValues: newselectedValues });
        //强制刷新数据
        this.props.onFilter(this.filterForData(this.state.selectedValues));
      }
    } else {
      //其他情况应该返回上一次的状态 具体来说就是不改变原有的selectedValues;
      // console.log("非more的情况");
      // console.log(selectedValues);
      selectedObj = selectedValues;
    }
    const newTitledSelectedStatus = this.checkIfHighLight(selectedObj, type);
    this.setState({
      openType: "",
      titleSelectedStatus: newTitledSelectedStatus,
    });
  };

  //辅助方法 判断是否应该高亮
  checkIfHighLight = (selectedObj, type) => {
    console.log(selectedObj);
    // console.log("type---" + type);
    const { titleSelectedStatus } = this.state;
    const newTitledSelectedStatus = { ...titleSelectedStatus };
    if (type !== "more") {
      const selectVal = selectedObj[type];
      if (
        type === "area" &&
        (selectVal.length !== 2 || selectVal[0] !== "area")
      ) {
        //选的是第一个区域
        newTitledSelectedStatus[type] = true;
      } else if (type === "mode" && selectVal[0] !== "null") {
        newTitledSelectedStatus[type] = true;
      } else if (type === "price" && selectVal[0] !== "null") {
        newTitledSelectedStatus[type] = true;
      } else {
        //不做处理
        newTitledSelectedStatus[type] = false;
      }
    } else if (type === "more") {
      if (selectedObj.length > 0) {
        //filterMore组件的处理
        newTitledSelectedStatus[type] = true;
      } else {
        newTitledSelectedStatus[type] = false;
      }
    }
    return newTitledSelectedStatus;
  };

  //保存内容
  onSave = async (selectedObj, type) => {
    // console.log(selectedObj);
    this.htmlbody.classList.remove("body-fixed");
    const newTitledSelectedStatus = this.checkIfHighLight(selectedObj, type);
    //selectedObj的type是more 我们就讨论一下
    if (type === "more") {
      //比较的是more下的数据有无更改 使用lodash
      const isequal = isEqual(this.state.selectedValues.more, selectedObj);
      if (isequal) {
        //一样 意味着不需要更新
        this.setState({
          openType: "",
        });
        return;
      }
    } else {
      const isequal = isEqual(this.state.selectedValues, selectedObj);
      if (isequal) {
        //一样 意味着不用更新
        this.setState({
          openType: "",
        });
        return;
      }
    }
    //使用await使得setState的异步回调变成同步 失了智
    await this.setState((state) => {
      const { selectedValues } = state;
      if (type === "more") {
        //比较一下和上次有没有不同
        const newSelectedValues = { ...selectedValues, [type]: selectedObj };
        // console.log("newSelectedValues===");
        // console.log(newSelectedValues);
        return {
          openType: "",
          selectedValues: newSelectedValues,
          titleSelectedStatus: newTitledSelectedStatus,
        };
      } else {
        return {
          openType: "",
          selectedValues: selectedObj,
          titleSelectedStatus: newTitledSelectedStatus,
        };
      }
    });

    //保存后就获取当前所有的数据
    const filterOrigin = { ...this.state.selectedValues };
    const reqdata = this.filterForData(filterOrigin);

    // console.log(reqdata);
    // debugger;
    // 传递给父组件 获取数据
    this.props.onFilter(reqdata);
    //筛选数据并获取
  };

  filterForData = (filterOrigin) => {
    const databag = {};
    const { area, mode, price, more } = filterOrigin;
    const areakey = area[0];
    let areaValue = "";
    if (area.length === 3) {
      area[2] === "null" ? (areaValue = area[1]) : (areaValue = area[2]);
    }
    databag[areakey] = areaValue;

    //方式和租金可以直接拿第一项 因为它只有一项
    databag["rentType"] = mode[0];
    //这里就取一个数字
    const price_num = price[0].substring(6);
    databag["price"] = price_num;
    //更多是一个字符串 我们要用逗号分割 但它是一整个字符串
    databag["more"] = more.join(",");

    // debugger;

    return databag;
  };

  //方法
  handleClick = (type) => {
    //使得点击遮罩外不能滑动
    this.htmlbody.classList.add("body-fixed");

    const { selectedValues, titleSelectedStatus } = this.state;
    //创建新的标题选中状态对象
    const newTitledSelectedStatus = { ...titleSelectedStatus };
    //遍历标题选中状态对象
    // console.log(selectedValues);
    Object.keys(titleSelectedStatus).forEach((key) => {
      if (key === type) {
        //这是当前标题 让它高亮
        newTitledSelectedStatus[key] = true;
      } else {
        const selectVal = selectedValues[key];
        // console.log("selectVal:" + selectVal + "---key:" + key);
        // console.log(selectVal);
        if (
          key === "area" &&
          (selectVal.length !== 2 || selectVal[0] !== "area")
        ) {
          //选的是第一个区域
          newTitledSelectedStatus[key] = true;
        } else if (key === "mode" && selectVal[0] !== "null") {
          newTitledSelectedStatus[key] = true;
        } else if (key === "price" && selectVal[0] !== "null") {
          newTitledSelectedStatus[key] = true;
        } else if (key === "more" && selectVal.length > 0) {
          //filterMore组件的处理
          newTitledSelectedStatus[key] = true;
        } else {
          //不做处理
          newTitledSelectedStatus[key] = false;
        }
      }
    });
    // console.log(newTitledSelectedStatus);
    this.setState((state) => {
      return {
        titleSelectedStatus: newTitledSelectedStatus,
        openType: type,
      };
    });

    // console.log(this.state.titleSelectedStatus);
  };

  shouldShowMask = () => {
    const { openType } = this.state;
    return openType === "mode" || openType === "area" || openType === "price";
  };

  changeFilterPickerSelected = (newSelectedValue) => {
    this.setState({
      selectedValues: newSelectedValue,
    });
  };

  changeFilterMoreSelected = (newSelected) => {
    const { selectedValues } = this.state;
    const newSelectedValues = { ...selectedValues, more: newSelected };
    this.setState({
      selectedValues: newSelectedValues,
    });
  };

  renderFilterPicker = () => {
    const shouldshow = this.shouldShowMask();
    if (!shouldshow) {
      return null;
    } else {
      let data = [];
      const { openType, filterObj } = this.state;
      let cols = 3;
      let defaultValue = this.state.selectedValues;
      // console.log("default-value----" + defaultValue);
      switch (openType) {
        case "area":
          const { area, subway } = filterObj;
          data = [area, subway];
          cols = 3;
          break;
        case "mode":
          const { rentType } = filterObj;
          // console.log(rentType);
          data = rentType;
          cols = 1;
          break;
        case "price":
          const { price } = filterObj;
          data = price;
          cols = 1;
        default:
          break;
      }

      //这里要传过去所有的值
      return (
        <FilterPicker
          onCancel={this.onCancel}
          onSave={this.onSave}
          data={data}
          cols={cols}
          type={this.state.openType}
          defaultValue={defaultValue}
          changeSelected={this.changeFilterPickerSelected}
        ></FilterPicker>
      );
    }
  };

  renderMask = () => {
    return this.shouldShowMask() ? (
      <Spring to={{ opacity: 1 }} from={{ opacity: 0 }}>
        {(props) => {
          return (
            <div
              style={props}
              className={styles.mask}
              onClick={() => {
                this.onCancel(this.state.openType);
              }}
            ></div>
          );
        }}
      </Spring>
    ) : (
      ""
    );
  };

  getFilterData = async () => {
    const res = await getCurrentCity();
    const value = res[0].value;
    const data = await request.get("/houses/condition", {
      params: { id: value },
    });

    this.setState({
      filterObj: data,
    });
  };

  componentWillUnmount() {
    //delete一个属性
    //delete this.props.match.params.filters;
    //console.log("filter unmount");
  }

  async componentDidMount() {
    await this.getFilterData();
    //根据location的state判断这里的高亮
    //页面卸载的时候去除state
    const filterDefaultSelect = this.props.location.state;
    if (filterDefaultSelect) {
      //有值
      console.log(filterDefaultSelect);
      if (isEqual(filterDefaultSelect.rentType, "true")) {
        defaultValues.mode = ["true"];
      } else {
        defaultValues.mode = ["false"];
      }

      const newTitledSelectedStatus = { ...this.state.titleSelectedStatus };
      newTitledSelectedStatus["mode"] = true;
      this.setState({
        titleSelectedStatus: newTitledSelectedStatus,
      });
    }
    this.setState({
      selectedValues: defaultValues,
    });

    //拿到body
    this.htmlbody = document.body;
  }

  renderFilterMore = () => {
    const { openType, filterObj } = this.state;
    if (openType !== "more") {
      return;
    } else {
      const { roomType, oriented, floor, characteristic } = filterObj;
      const data = { roomType, oriented, floor, characteristic };
      const defaultValue = this.state.selectedValues.more;
      // debugger;
      return (
        <FilterMore
          data={data}
          onSave={this.onSave}
          type={openType}
          defaultValue={defaultValue}
          onleave={this.onCancel}
          changeSelected={this.changeFilterMoreSelected}
        />
      );
    }
  };

  render() {
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        {this.renderMask()}
        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleSelectedStatus={this.state.titleSelectedStatus}
            handleClick={this.handleClick}
          />

          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}
        </div>
      </div>
    );
  }
}

export default withRouter(Filter);
