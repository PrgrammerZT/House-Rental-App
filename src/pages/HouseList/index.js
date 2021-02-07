import { Flex, Toast } from "antd-mobile";
import React, { createRef } from "react";
import SearchHeader from "../../components/SearchHeader";
import { getCurrentCity } from "../../utils";
import HouseItems from "../../components/HouseItems";
import styles from "./index.module.css";
import Filter from "./components/Filter";
import request from "../../utils/request";
import NoHouse from "../../components/NoHouse";
import {
  List,
  AutoSizer,
  WindowScroller,
  InfiniteLoader,
} from "react-virtualized";
import Sticky from "../../components/Sticky";
import { isNumber } from "lodash";
export default class HouseList extends React.PureComponent {
  state = {
    city: "",
    list: [],
    count: 0,
    //初始化数据 挂载到整个类上
    filters: {
      area: "",
      mode: null,
      price: "",
      more: [],
    },
  };

  sticky = createRef();

  getCity = async () => {
    const result = await getCurrentCity();
    return result[0].label;
  };

  componentDidMount = async () => {
    const city = await this.getCity();
    // filter的获取;
    let filters = this.props.location.state;
    console.log(filters);
    if (filters) {
      this.setState({
        filters,
        city,
      });

      //通知filters组件更新状态
    } else {
      this.setState({
        city,
      });
    }

    //进入页面时就要获取数据并且展示数据
    await this.showHouse();

    this.sticky.current.handleListPadding();
  };

  showHouse = async () => {
    const data = await this.searchHouseList();
    const { list, count } = data;
    if (count !== 0) {
      //加载提示
      Toast.info("共找到" + count + "条房源", 2, null, true);
    }
    this.setState((state) => {
      return {
        list,
        count,
      };
    });
  };

  onFilters = async (filters) => {
    console.log("filter update");
    //封装为一个全局变量
    await this.setState({
      filters,
    });
    //展示房屋
    console.log(this.state.filters);
    window.scrollTo(0, 0);
    await this.showHouse();
  };

  searchHouseList = async () => {
    //通过HouseList搜索
    const res = await getCurrentCity();
    const value = res[0].value;
    const { filters } = this.state;
    // debugger;
    console.log(filters, value);
    const data = await request.get("/houses", {
      params: {
        cityId: value,
        ...filters,
        start: 1,
        end: 20,
      },
    });
    console.log("data", data);
    return data;
  };

  isRowLoaded = ({ index }) => {
    //判断列表中的每一行是否加载完成
    return this.state.list[index];
  };

  loadMoreRows = async ({ startIndex, stopIndex }) => {
    const res = await getCurrentCity();
    const cityId = res[0].value;
    return new Promise((resolve, reject) => {
      const { filters } = this.state;
      request
        .get("/houses", {
          params: {
            cityId,
            ...filters,
            start: startIndex,
            end: startIndex + 20,
          },
        })
        .then(async (res) => {
          const data = res;
          const newList = [...this.state.list, ...data.list];
          await this.setState({
            list: newList,
          });
          resolve();
        });
    });
  };

  renderNoHouse = () => {
    if (request.isLoading === false && this.state.count === 0) {
      return <NoHouse>没有找到房源 请您换个搜索条件吧~</NoHouse>;
    }
    return false;
  };

  rowRender = ({
    key, // Unique key within array of rows
    index, // 索引号
    style, // 样式 指定每一行在哪个位置
  }) => {
    const { list } = this.state;
    const house = list[index];
    if (house) {
      return (
        <HouseItems
          key={key}
          style={style}
          houseImg={house.houseImg}
          desc={house.desc}
          title={house.title}
          price={house.price}
          houseCode={house.houseCode}
          tags={house.tags}
        ></HouseItems>
      );
    }
    //渲染一个占位符
    else {
      <div key={key} style={style}>
        <p className={styles.loadingHolder}></p>
      </div>;
    }
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
        <Sticky height={40} ref={this.sticky}>
          <Filter onFilter={this.onFilters}></Filter>
        </Sticky>
        <div className={styles.houseItems}>
          {/* InfiniteLoader */}
          {this.renderNoHouse() || (
            <InfiniteLoader
              isRowLoaded={this.isRowLoaded}
              loadMoreRows={this.loadMoreRows}
              rowCount={this.state.count}
            >
              {({ onRowsRendered, registerChild }) => {
                {
                  /* 渲染结构 */
                }
                return (
                  <WindowScroller>
                    {({ height, isScrolling, scrollTop }) => {
                      return (
                        <AutoSizer>
                          {({ width }) => {
                            return (
                              <List
                                autoHeight //这是真正的高度 设置为windowScroller的高度
                                width={width} //视口的高度
                                height={height} //视口的宽度
                                rowCount={this.state.count}
                                rowHeight={120} /**每一行的高度 */
                                rowRenderer={this.rowRender}
                                isScrolling={isScrolling}
                                scrollTop={scrollTop}
                                onRowsRendered={onRowsRendered}
                                ref={registerChild}
                              />
                            );
                          }}
                        </AutoSizer>
                      );
                    }}
                  </WindowScroller>
                );
              }}
            </InfiniteLoader>
          )}
        </div>
      </div>
    );
  }
}
