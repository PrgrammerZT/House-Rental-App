import { Flex } from "antd-mobile";
import React from "react";
import SearchHeader from "../../components/SearchHeader";
import { getCurrentCity } from "../../utils";
import styles from "./index.module.css";
import Filter from "./components/Filter";
import request from "../../utils/request";
export default class HouseList extends React.PureComponent {
  state = {
    city: "",
    list: [],
    count: 0,
  };

  //初始化数据
  filters = {};

  getCity = async () => {
    const result = await getCurrentCity();
    return result[0].label;
  };
  async componentDidMount() {
    const city = await this.getCity();
    this.setState({
      city,
    });

    //进入页面时就要获取数据
    this.searchHouseList();
  }

  onFilters = async (filters) => {
    //封装为一个全局变量
    this.filters = filters;
    // debugger;

    const data = await this.searchHouseList();
    const HouseSource = data.body;

    const { list, count } = HouseSource;
    this.setState({
      list,
      count,
    });
  };

  searchHouseList = async () => {
    //通过HouseList搜索
    const res = await getCurrentCity();
    const value = res[0].value;
    const { data } = await request.get("/houses", {
      params: {
        cityId: value,
        ...this.filters,
        start: 1,
        end: 20,
      },
    });

    return data;
  };

  render() {
    return (
      <div className={styles.house_list}>
        <Flex className={styles.header}>
          <i
            className={["iconfont", "icon-back", styles.iconback].join(" ")}
            onClick={() => {
              this.props.history.go(-1);
            }}
          ></i>
          <SearchHeader
            city={this.state.city}
            className={styles.house_search}
            iconColor="#00ae66"
          ></SearchHeader>
        </Flex>
        <Filter onFilter={this.onFilters}></Filter>
      </div>
    );
  }
}
