import React, { Suspense } from "react";
//1.导入路由
import { Redirect, Route, Switch } from "react-router-dom";
import { TabBar } from "antd-mobile";
import Home from "../pages/Home";
//因为需要HouseList的样式覆盖Home组件的样式
import HouseList from "../pages/HouseList";
import News from "../pages/News";
import Profile from "../pages/Profile";

const Tabs = [
  { title: "首页", icon: "icon-house", route: "/home/index" },
  { title: "找房", icon: "icon-findHouse", route: "/home/houselist" },
  { title: "资讯", icon: "icon-inform", route: "/home/news" },
  { title: "我的", icon: "icon-my", route: "/home/profile" },
];
export default class HomeTab extends React.PureComponent {
  state = {
    selectedTab: this.props.location.pathname,
  };

  componentDidMount() {}

  componentDidUpdate(prevprops) {
    //路由的信息通过props传递给组件的 没有比较条件就会无限递归
    if (prevprops.location.pathname !== this.props.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname,
      });
    }
  }

  render() {
    return (
      <div className="home" style={{ paddingBottom: 50 }}>
        <Suspense fallback={<div>Loading</div>}>
          <Switch>
            <Route path="/home/news" component={News} exact={true}></Route>
            <Route
              path="/home/profile"
              component={Profile}
              exact={true}
            ></Route>
            <Route
              path="/home/houselist"
              component={HouseList}
              exact={true}
            ></Route>
            <Route path="/home/index" component={Home} exact={true}></Route>
            {/* 不能重定向超过两次 */}
            <Route
              path="/home"
              render={() => <Redirect to="/home/index"></Redirect>}
              exact={true}
            ></Route>
            <Route path="*" render={() => <h1>Page Not Found 404</h1>}></Route>
          </Switch>
        </Suspense>
        {/* 把TabBar放在这 */}
        <TabBar
          unselectedTintColor="#888"
          tintColor="#21b97a"
          barTintColor="white"
          noRenderContent={true}
          prerenderingSiblingsNumber={Infinity}
        >
          {Tabs.map((item) => {
            return (
              <TabBar.Item
                icon={<i className={`iconfont ${item.icon}`}></i>}
                selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
                title={item.title}
                key={item.title}
                selected={this.state.selectedTab === item.route}
                onPress={() => {
                  this.setState({
                    selectedTab: item.route,
                  });

                  this.props.history.replace(item.route);
                }}
              ></TabBar.Item>
            );
          })}
        </TabBar>
      </div>
    );
  }
}
