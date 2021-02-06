import React from "react";
import { Flex, Carousel, Grid, WingBlank } from "antd-mobile";
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
  { img: Nav1, title: "整租" },
  { img: Nav2, title: "合租" },
  { img: Nav3, title: "地图找房" },
  { img: Nav4, title: "去出租" },
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
    const { data } = await request.get("/home/news", {
      params: { area: this.state.cityVal },
    });

    const { body } = data;
    this.setState(() => {
      return {
        news: body,
      };
    });
  }
  async getGroup() {
    const { data } = await request.get("/home/groups", {
      params: { area: this.state.cityVal },
    });

    const { body } = data;

    this.setState({
      groups: body,
    });
  }

  async getData() {
    const { data } = await request.get("/home/swiper");
    const { body } = data;
    this.setState({
      data: body,
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
                  this.props.history.push("/home/houselist");
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
