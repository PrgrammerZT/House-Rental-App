import React from "react";
import { withRouter } from "react-router-dom";
import BASE_URL from "../../utils/url";
import styles from "./index.module.css";
class HouseItems extends React.PureComponent {
  render() {
    const { houseImg, title, desc, tags, price, houseCode, style } = this.props;
    return (
      <div
        className={styles.house}
        key={houseImg}
        style={style}
        onClick={
          //这里要跳转到详情页面 传入一个函数 而不是一个返回值
          () => {
            this.props.history.push(`/detail/${houseCode}`);
          }
        }
      >
        <div className={styles.imgWrap}>
          <img className={styles.img} src={BASE_URL + houseImg} alt="" />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.desc}>{desc}</div>
          <div>
            {tags.map((item, index) => {
              const title = `tag${(index % 3) + 1}`;
              return (
                <span
                  className={[styles.tag, styles[title]].join(" ")}
                  key={item}
                >
                  {item}
                </span>
              );
            })}
          </div>
          <div className={styles.price}>
            <span className={styles.priceNum}>{price}</span> 元/月
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(HouseItems);
