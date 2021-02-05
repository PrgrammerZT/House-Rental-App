import { Flex } from "antd-mobile";
import React from "react";
import SearchHeader from "../../components/SearchHeader";
import { getCurrentCity } from "../../utils";
import styles from "./index.module.css";
import Filter from "./components/Filter";
export default class HouseList extends React.PureComponent {
  state = {
    city: "",
  };
  getCity = async () => {
    const result = await getCurrentCity();
    return result[0].label;
  };
  async componentDidMount() {
    const city = await this.getCity();
    this.setState({
      city,
    });
  }
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
        <Filter></Filter>
      </div>
    );
  }
}
