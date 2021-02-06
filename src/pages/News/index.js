import React from "react";
import { Flex, Carousel, Grid, WingBlank } from "antd-mobile";
import request from "../../utils/request";
export default class News extends React.PureComponent {
  state = {
    news: [],
  };
  async getNews() {
    const cityVal = localStorage.getItem("hkzf_city")[0].value;
    const { data } = await request.get("/home/news", {
      params: { area: cityVal },
    });

    // console.log(data);

    const { body } = data;
    this.setState(() => {
      return {
        news: body,
      };
    });
  }
  componentDidMount() {
    this.getNews();
  }
  render() {
    return (
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
                <Flex className="content" direction="column" justify="between">
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
    );
  }
}
