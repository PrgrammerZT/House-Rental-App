import React, { Component } from "react";

import { PickerView } from "antd-mobile";

import FilterFooter from "../../../../components/FilterFooter";

export default class FilterPicker extends Component {
  state = {
    value: "",
    selectedValue: {},
  };
  componentDidMount() {
    const { defaultValue, type } = this.props;
    // console.log(defaultValue);
    this.setState({
      selectedValue: defaultValue,
      value: defaultValue[type],
    });

    console.log("picker create");
  }
  render() {
    const {
      onCancel,
      onSave,
      data,
      cols,
      type,
      defaultValue,
      changeSelected,
    } = this.props;
    return (
      <>
        {/* 选择器组件： */}
        <PickerView
          data={data}
          value={this.state.value}
          cols={cols}
          onChange={(newvalue) => {
            this.setState((state, props) => {
              const newSelected = { ...defaultValue, [type]: newvalue };
              // //把这个东西给changeSelected
              // changeSelected(newSelected);
              return {
                value: newvalue,
                selectedValue: newSelected,
              };
            });
          }}
        />

        {/* 底部按钮 */}
        <FilterFooter
          onCancel={() => {
            onCancel(type);
          }}
          onOk={() => {
            // console.log(this.state.selectedValue)
            onSave(this.state.selectedValue, type);
          }}
        />
      </>
    );
  }
}
