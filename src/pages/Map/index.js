import axios from "axios";
import React from "react";
import NavHeader from "../../components/NavHeader";
import { getCurrentCity } from "../../utils";
import styles from "./index.module.css";
import { Link } from "react-router-dom";
import BASE_URL from "../../utils/url";
import HouseItems from "../../components/HouseItems";
async function getCity() {
  const res = await getCurrentCity();
  return { label: res[0].label, value: res[0].value };
}

export default class Map extends React.PureComponent {
  state = {
    houseList: [], //小区下的房源列表
    isShowList: false, //是否展示房源列表
  };
  async componentDidMount() {
    this.initMap();
  }

  //获取覆盖物的信息
  getRenderInfo = async (id) => {
    const { data } = await axios.get("http://localhost:8080/area/map", {
      params: { id },
    });

    return data.body;
  };

  //获取缩放级别和类型
  getTypeAndZoom = () => {
    //获取当前缩放级别
    const zoom = this.map.getZoom();
    //nextZoom表示下一次的缩放级别
    let nextZoom;
    //type表示绘制什么样的覆盖物
    let nextType;
    if (zoom < 12 && zoom >= 10) {
      nextZoom = 13;
      nextType = "circle";
    } else if (zoom >= 12 && zoom < 14) {
      nextZoom = 15;
      nextType = "rect";
    }

    return {
      nextType,
      nextZoom,
    };
  };

  renderHouseMap = (label, data, zoomSize, type, mypoint) => {
    this.myGeo.getPoint(
      label,
      (point) => {
        if (mypoint) {
          point = mypoint;
        }
        this.map.centerAndZoom(point, zoomSize);
        data.forEach(async (item) => {
          // console.log(item)
          // console.log(zoomSize);
          await this.createOverlay(item, zoomSize, type);
        });
      },
      label
    );
  };

  createCircle = ({ label, value, count, opts, zoom }) => {
    const labelStyle = {
      cursor: "pointer",
      border: "0px solid rgb(255,0,0)",
      padding: "0px",
      whiteSpace: "nowrap",
      fontSize: "12px",
      color: "rbg(255,255,255)",
      textAlign: "center",
    };
    //添加文本 React中需要window
    const content = new window.BMapGL.Label("", opts);
    //设置setContent后 设置的文本内容就无效了
    content.setContent(
      `<div class="${styles.bubble}">
              <p class="${styles.name}">${label}</p>
              <p>${count}套</p>
            </div>`
    );
    content.setStyle(labelStyle);
    //绑定了点击事件
    content.addEventListener("click", async () => {
      const res = await this.getRenderInfo(value);
      this.map.centerAndZoom(opts.position, zoom);
      const { nextType, nextZoom } = this.getTypeAndZoom();
      // console.log("zoom---" + zoom + "nextZoom----" + nextZoom);
      //清除当前覆盖物信息
      //解决百度地图JS文件自身报错的问题
      //setTimeout(map.clearOverlays(), 0);
      //要重新调用方法
      // console.log(res);
      // console.log(nextType);
      this.renderHouseMap(label, res, nextZoom, nextType, opts.position);
      this.map.clearOverlays();
    });
    this.map.addOverlay(content);
  };

  getPurchaseList = async (key) => {
    const { data } = await axios.get("http://localhost:8080/houses", {
      params: { cityId: key },
    });

    // console.log(data.body);
    this.setState({
      houseList: data.body.list,
    });
    return data;
  };

  createRect = ({ label, value, count, opts }) => {
    // console.log(label);
    // console.log("create-rect");
    const labelStyle = {
      cursor: "pointer",
      border: "0px solid rgb(255,0,0)",
      padding: "0px",
      whiteSpace: "nowrap",
      fontSize: "12px",
      color: "rbg(255,255,255)",
      textAlign: "center",
    };
    //添加文本 React中需要window
    const content = new window.BMapGL.Label("", opts);
    //设置setContent后 设置的文本内容就无效了
    content.setContent(
      `<div class="${styles.rect}">
        <span class="${styles.housename}">${label}</span>
        <span class="${styles.housenum}">${count}套</span>
        <i class="${styles.arrow}"></i>
      </div>`
    );
    content.setStyle(labelStyle);
    //绑定了点击事件
    content.addEventListener("click", async ({ domEvent }) => {
      //获取房源列表和数据
      await this.getPurchaseList(value);

      //计算公式
      const target = domEvent.changedTouches[0];
      //移动target
      this.map.panBy(
        window.innerWidth / 2 - target.clientX,
        (window.innerHeight - 330) / 2 - target.clientY
      );

      this.setState({
        isShowList: true,
      });
    });
    this.map.addOverlay(content);
  };

  createOverlay = (data, zoom, type) => {
    const { label, value, coord, count } = data;
    let { longitude, latitude } = coord;
    const point = new window.BMapGL.Point(longitude, latitude);

    //zoom<15 因为会发现type是circle但是zoom是15
    if (type === "circle" && zoom < 15) {
      const opts = {
        position: point,
        offset: new window.BMapGL.Size(-35, -35),
      };
      this.createCircle({ label, value, count, opts, zoom });
    } else {
      //不需要传递zoom
      const opts = {
        position: point,
        offset: new window.BMapGL.Size(-50, -28),
      };
      this.createRect({ label, value, count, opts });
    }
  };

  async initMap() {
    //获取城市
    const { label, value } = await getCity();
    //获取数据
    const res = await this.getRenderInfo(value);

    // 初始化地图
    const map = new window.BMapGL.Map("container");
    //挂载map为全局对象 防止传参
    this.map = map;

    //地址解析
    const myGeo = new window.BMapGL.Geocoder();
    //挂载地址解析器为类的对象
    this.myGeo = myGeo;
    //初始放大倍数
    const zoomSize = 10;

    //调用回调函数渲染地图和覆盖物即可
    this.renderHouseMap(label, res, zoomSize, "circle");

    //添加缩放的控件
    //添加比例尺控件
    map.addControl(new window.BMapGL.ZoomControl());
    map.addControl(new window.BMapGL.ScaleControl());

    //绑定移动事件 移动的时候就不展示下方的栏
    map.addEventListener("movestart", (e) => {
      const { isShowList } = this.state;
      if (isShowList === true) {
        this.setState({
          isShowList: false,
        });
      }
    });
  }

  renderHouseBottom = () => {};
  render() {
    return (
      <div className={styles.map}>
        <NavHeader>地图找房</NavHeader>
        <div id="container" className={styles.container}></div>
        {/* 房源列表的渲染 */}
        <div
          className={[
            styles.houseList,
            this.state.isShowList ? styles.show : "",
          ].join(" ")}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <Link className={styles.titleMore} to="/home/houselist">
              更多房源
            </Link>
          </div>
          <div className={styles.houseItems}>
            {this.state.houseList.map((item) => {
              return (
                <HouseItems
                  houseImg={item.houseImg}
                  tags={item.tags}
                  title={item.title}
                  desc={item.desc}
                  price={item.price}
                ></HouseItems>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
