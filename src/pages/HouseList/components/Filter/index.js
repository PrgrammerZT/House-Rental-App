import React, { Component } from "react";

import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";
import request from "../../../../utils/request";
import styles from "./index.module.css";
import { getCurrentCity } from "../../../../utils";
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
export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    openType: "",
    filterObj: {},
    selectedValues: {},
  };
  //隐藏对话框
  onCancel = (type) => {
    //Cancel的时候
    //type正确 但是要拿到selectedObj
    const { selectedValues } = this.state;
    let selectedObj = {};
    if (type === "more") {
      selectedObj = selectedValues[type];
    } else {
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
    console.log("type---" + type);
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
  onSave = (selectedObj, type) => {
    const newTitledSelectedStatus = this.checkIfHighLight(selectedObj, type);

    this.setState((state) => {
      const { selectedValues } = state;
      if (type === "more") {
        const newSelectedValues = { ...selectedValues, [type]: selectedObj };
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
  };
  //方法
  handleClick = (type) => {
    const { selectedValues, titleSelectedStatus } = this.state;
    //创建新的标题选中状态对象
    const newTitledSelectedStatus = { ...titleSelectedStatus };
    //遍历标题选中状态对象
    console.log(selectedValues);
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

  changeSelected = (newSelectedValue) => {
    this.setState({
      selectedValues: newSelectedValue,
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
          changeSelected={this.changeSelected}
        ></FilterPicker>
      );
    }
  };

  renderMask = () => {
    return this.shouldShowMask() ? (
      <div
        className={styles.mask}
        onClick={() => {
          this.onCancel(this.state.openType);
        }}
      ></div>
    ) : (
      ""
    );
  };

  getFilterData = async () => {
    const res = await getCurrentCity();
    const value = res[0].value;
    const { data } = await request.get("/houses/condition", {
      params: { id: value },
    });
    const { body } = data;
    this.setState({
      filterObj: body,
    });
  };

  async componentDidMount() {
    await this.getFilterData();
    this.setState({
      selectedValues: defaultValues,
    });
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
