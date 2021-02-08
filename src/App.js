import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";

//导入懒加载页面 但是首页就不必了
import HomeTab from "./routes/HomeTab";
import CityList from "./pages/CityList";
import map from "./pages/Map";
import HouseDetail from "./pages/HouseDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
class App extends React.PureComponent {
  render() {
    return (
      <Suspense fallback={<div>Loading</div>}>
        <Router>
          {/* 配置导航菜单 */}
          <Switch>
            <Route path="/home" component={HomeTab}></Route>
            <Route path="/CityList" component={CityList} exact={true}></Route>
            <Route path="/map" component={map} exact={true}></Route>
            <Route
              path="/detail/:id"
              component={HouseDetail}
              exact={true}
            ></Route>
            <Route path="/login" exact={true} component={Login}></Route>
            <Route path="/register" exact={true} component={Register}></Route>
            <Route
              path="/"
              exact={true}
              render={() => <Redirect to="/home/index"></Redirect>}
            ></Route>
            <Route path="*" render={() => <h1>Page Not Found 404</h1>}></Route>
          </Switch>
        </Router>
      </Suspense>
    );
  }
}

export default App;
