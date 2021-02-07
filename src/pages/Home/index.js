import React from "react";
import { Flex, Carousel, Grid, WingBlank, Toast } from "antd-mobile";
import request from "../../utils/request";
import Nav1 from "../../assets/images/nav-1.png";
import Nav2 from "../../assets/images/nav-2.png";
import Nav3 from "../../assets/images/nav-3.png";
import Nav4 from "../../assets/images/nav-4.png";
import "./index.css";
import BASE_URL from "../../utils/url";
import { getCurrentCity } from "../../utils";
import SearchHeader from "../../components/SearchHeader";

const navItem = [
  {
    img: Nav1,
    title: "整租",
    to: {
      path: "/home/houselist",
      state: {
        area: "",
        rentType: "true",
        price: "",
        more: "",
      },
    },
  },
  {
    img: Nav2,
    title: "合租",
    to: {
      path: "/home/houselist",
      state: {
        area: "",
        rentType: "false",
        price: "",
        more: "",
      },
    },
  },
  {
    img: Nav3,
    title: "地图找房",
    to: {
      path: "/map",
    },
  },
  { img: Nav4, title: "去出租", to: { path: "", state: "", disabled: true } },
];

export default class Home extends React.PureComponent {
  state = {
    data: [],
    CarouselDidLoad: false,
    groups: [],
    news: [],
    city: "上海",
    cityVal: "",
  };
  async getNews() {
    console.log(this.state.cityVal);
    const data = await request.get("/home/news", {
      params: { area: this.state.cityVal },
    });

    this.setState(() => {
      return {
        news: data,
      };
    });
  }
  async getGroup() {
    const data = await request.get("/home/groups", {
      params: { area: this.state.cityVal },
    });

    this.setState({
      groups: data,
    });
  }

  async getData() {
    const data = await request.get("/home/swiper");

    this.setState({
      data: data,
      CarouselDidLoad: true,
    });
  }

  componentDidMount() {
    getCurrentCity().then(async (res) => {
      await this.setState({
        city: res[0].label,
        cityVal: res[0].value,
      });

      this.getData();
      this.getGroup();
      this.getNews();
    });
  }
  render() {
    return (
      <div>
        <div className="swiper">
          {this.state.CarouselDidLoad === true ? (
            <Carousel autoplay={true} infinite autoplayInterval={5000}>
              {this.state.data.map((val) => (
                <img
                  src={BASE_URL + val.imgSrc}
                  alt=""
                  style={{
                    width: "100%",
                    verticalAlign: "top",
                    height: "212px",
                  }}
                  key={val.id}
                />
              ))}
            </Carousel>
          ) : (
            ""
          )}
        </div>
        <Flex className="nav-item">
          {navItem.map((item) => {
            return (
              <Flex.Item
                key={item.title}
                onClick={() => {
                  if (item.to.disabled) {
                    Toast.info("功能尚未实现 敬请期待", 1.5, null, false);
                  } else {
                    this.props.history.replace(item.to.path, item.to.state);
                  }
                }}
              >
                <img src={item.img}></img>
                <h3>{item.title}</h3>
              </Flex.Item>
            );
          })}
        </Flex>

        <div className="group">
          <h3 className="group-title">
            租房小组 <span className="more">更多</span>
          </h3>
          <Grid
            columnNum={2}
            data={this.state.groups}
            square={false}
            hasLine={false}
            renderItem={(item) => {
              return (
                <Flex className="group-item" justify="around">
                  <div className="desc">
                    <p className="title">{item.title}</p>
                    <span className="info">{item.desc}</span>
                  </div>
                  <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
                </Flex>
              );
            }}
          ></Grid>
        </div>
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">
            {this.state.news.map((item) => {
              return (
                <div className="news-item" key={item.id}>
                  <div className="imgwrap">
                    <img
                      className="img"
                      src={`http://localhost:8080${item.imgSrc}`}
                      alt=""
                    />
                  </div>
                  <Flex
                    className="content"
                    direction="column"
                    justify="between"
                  >
                    <h3 className="title">{item.title}</h3>
                    <Flex className="info" justify="between">
                      <span>{item.from}</span>
                      <span>{item.date}</span>
                    </Flex>
                  </Flex>
                </div>
              );
            })}
          </WingBlank>
        </div>
        <SearchHeader city={this.state.city}></SearchHeader>
      </div>
    );
  }
}
