import React from "react";
import { NavBar, Icon, Toast } from "antd-mobile";
import request from "../../utils/request";
import "./index.css";
import { getCurrentCity } from "../../utils";
import { List, AutoSizer } from "react-virtualized";
import NavHeader from "../../components/NavHeader";

const TILTE_HEIGHT = 36;
const CITY_HEIGHT = 50;
const formatCityIndex = (letter) => {
  let returnLetter = "";
  switch (letter) {
    case "#":
      returnLetter = "当前城市";
      break;
    case "hot":
      returnLetter = "热门城市";
      break;
    default:
      returnLetter = letter.toUpperCase();
      break;
  }

  return returnLetter;
};

export default class CityList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cityIndex: [],
      cityList: {},
      indexActive: "#",
      cityOffset: [],
    };

    this.cityListComponet = React.createRef();
  }
  formatCityList = (list) => {
    const cityList = {};

    list.forEach((item) => {
      const first = item.short.substring(0, 1);
      if (cityList[first]) {
        //有这个分类
        //直接往这个分类里面push数据
        cityList[first].push(item);
      } else {
        cityList[first] = [item];
      }
    });

    //获取索引数据

    const cityIndex = Object.keys(cityList).sort();

    return {
      cityList,
      cityIndex,
    };
  };
  async getCityList() {
    const data = await request.get("/area/city", {
      params: { level: 1 },
    });

    const { cityList, cityIndex } = this.formatCityList(data);

    //获取热门数据
    const hotres = await request.get("/area/hot");

    cityList["hot"] = hotres;
    cityIndex.unshift("hot");

    // console.log(cityList);
    // console.log(cityIndex);

    const curcity = await getCurrentCity();

    cityList["#"] = curcity;

    cityIndex.unshift("#");

    //初始化cityOffset
    const cityOffset = this.getCityOffset(cityIndex, cityList);
    console.log(cityOffset);
    this.setState({
      cityList,
      cityIndex,
      cityOffset,
    });

    this.measureRows();
  }

  getCityOffset = (cityIndex, cityList) => {
    const cityOffset = [];
    cityOffset[0] = 0;
    for (let i = 0; i < cityIndex.length - 1; i++) {
      const itemHeight =
        cityList[cityIndex[i]].length * CITY_HEIGHT + TILTE_HEIGHT;
      cityOffset[i + 1] = cityOffset[i] + itemHeight;
    }

    return cityOffset;
  };

  measureRows = () => {
    this.cityListComponet.current.measureAllRows();
  };

  getRowHeight = ({ index }) => {
    //索引标题高度+城市数量*城市名称高度
    const { cityList, cityIndex } = this.state;
    return cityList[cityIndex[index]].length * CITY_HEIGHT + TILTE_HEIGHT;
  };

  changeCity = ({ label, value }) => {
    const city = ["北京", "上海", "广州", "深圳"];
    console.log(label);
    const isfind = city.indexOf(label);
    if (isfind > -1) {
      localStorage.setItem("hkzf_city", JSON.stringify({ label, value }));
      this.props.history.go(-1);
    } else {
      //提示用户没有房源信息
      Toast.info("该城市暂无房源信息", 1.5);
    }
  };

  rowRenderer = ({
    key, // Unique key within array of rows
    index, // 索引号
    isScrolling, // 当前项是否正在滚动中
    isVisible, // 当前项在列表中是否可见
    style, // 样式 指定每一行在哪个位置
  }) => {
    const { cityList, cityIndex } = this.state;
    const letter = cityIndex[index];
    const citys = cityList[letter];
    // console.log(citys);
    // console.log(letter);
    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(letter)}</div>
        {citys.map((item) => {
          return (
            <div
              className="name"
              key={item.value}
              onClick={() => {
                this.changeCity(item);
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    );
  };

  renderCityIndex = () => {
    const { cityIndex, indexActive } = this.state;
    return cityIndex.map((item, index) => {
      return (
        <li
          className="city-index-item"
          key={item}
          onClick={() => {
            this.setState((state, props) => {
              const { indexActive } = state;
              this.cityListComponet.current.scrollToRow(index);
              return {
                indexActive: item,
              };
            });

            // console.log(item);
          }}
        >
          <span className={indexActive === item ? "index-active" : ""}>
            {item === "hot" ? "热" : item}
          </span>
        </li>
      );
    });
  };

  onScrollChangeIndex = ({ startIndex, scrollTop }) => {
    // //把滚动到的索引 判断值在哪几个之间
    const { cityList, cityIndex, cityOffset } = this.state;
    if (scrollTop <= cityOffset[cityOffset.length - 1] && scrollTop >= 86) {
      for (let i = 0; i < cityOffset.length - 1; i++) {
        if (Math.ceil(scrollTop) + 30 >= cityOffset[i + 1]) {
          //问题出在微小的抖动上 需要调用天花板函数处理
          this.setState((state, props) => {
            return {
              indexActive: cityIndex[i + 1],
            };
          });
        }
      }
    } else {
      this.setState((state, props) => {
        const { indexActive, cityIndex } = state;
        // console.log(cityIndex);
        return {
          indexActive: "#",
        };
      });
    }
  };

  componentDidMount() {
    this.getCityList();
    //必须等待异步执行完成 再调用measureAllRows()方法
  }
  render() {
    return (
      <div className="cityList">
        <NavHeader>城市选择</NavHeader>

        <AutoSizer>
          {({ height, width }) => {
            return (
              <List
                ref={this.cityListComponet}
                height={height}
                rowCount={this.state.cityIndex.length}
                rowHeight={this.getRowHeight}
                rowRenderer={this.rowRenderer}
                width={width}
                onScroll={this.onScrollChangeIndex}
                scrollToAlignment="start"
              />
            );
          }}
        </AutoSizer>
        <ul className="city-index">{this.renderCityIndex()}</ul>
      </div>
    );
  }
}
