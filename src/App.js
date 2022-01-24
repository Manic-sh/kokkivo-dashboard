import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Homepage from "./views/Homepage.js";
import Order from "./views/Order.js";
import Report from "./views/Reports.js";
import Product from "./views/Products.js";
import Landing from "./views/Landing.js";
import Login from "./views/LoginPage.js";
import Profile from "./views/Profile.js";
import ProductStore from "./views/ProductStore.js";
import Shop from "./views/Shop.js";
import { Layout } from "antd";
import ProductDetailCustomize from "./views/ProductDetailCustomize.js";

import SiderNavigation from "./components/SideBarNavigation";
import AuthService from "./helpers/auth-service";

const { Content } = Layout;

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          {AuthService.userLoggedIn() ? <SiderNavigation /> : <></>}

          <Layout style={{ marginLeft: 90, marginRight: 10 }}>
            <Content style={{ marginLeft: "16px", overflow: "initial" }}>
              <Switch key="01">
                {AuthService.userLoggedIn() && (
                  <>
                    <Route exact path="/" component={Homepage} />
                    <Route exact path="/homepage/" component={Homepage} />
                    <Route exact path="/products/" component={Product} />
                    <Route exact path="/profile/" component={Profile} />
                    <Route exact path="/order/:id/" component={Order} />
                    <Route exact path="/reports/" component={Report} />
                    <Route exact path="/store/" component={ProductStore} />
                    <Route exact path="/shop/" component={Shop} />
                    <Route
                      exact
                      path="/ProductCustomize/:id/"
                      component={ProductDetailCustomize}
                    />
                  </>
                )}
                <Route exact path={["/", "/landing"]} component={Landing} />
                <Route exact path="/login" component={Login} />
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </BrowserRouter>
    );
  }
}
export default App;

/*
          <Header
            className="card-shadow"
            style={{
              backgroundColor: "#200F21",
              position: "fixed",
              zIndex: 1,
              width: "100%",
              padding: 0,
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            {AuthService.userLoggedIn() ? <MyNavBar /> : <></>}
          </Header>
          */
