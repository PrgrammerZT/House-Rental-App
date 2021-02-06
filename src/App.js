import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";

//导入页面
import HomeTab from "./routes/HomeTab";
import CityList from "./pages/CityList";
import map from "./pages/Map";
import HouseDetail from "./pages/HouseDetail";
class App extends React.PureComponent {
  render() {
    return (
      <Router>
        {/* 配置导航菜单 */}
        <Switch>
          <Route path="/home" component={HomeTab}></Route>
          <Route path="/CityList" component={CityList}></Route>
          <Route path="/map" component={map}></Route>
          <Route path="/detail/:id" component={HouseDetail}></Route>
          <Route
            path="/"
            exact={true}
            render={() => <Redirect to="/home/index"></Redirect>}
          ></Route>
          <Route path="*" render={() => <h1>Page Not Found 404</h1>}></Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
