import React from "react";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  HomeFilled,
  SkinFilled,
  ToolFilled,
  ContainerFilled,
  FundFilled,
  DollarCircleFilled,
  LogoutOutlined,
} from "@ant-design/icons";
import AuthService from "../helpers/auth-service";

const { Sider } = Layout;

export default class SiderNavigation extends React.Component {
  logOut() {
    AuthService.logout();
  }

  render() {
    let currentUser = AuthService.userLoggedIn();

    return (
      <>
        {currentUser ? (
          <Sider className="left-nav-sider card-shadow">
            <div className="logo-sider" />
            <Menu theme="dark" mode="vertical" defaultSelectedKeys={["1"]}>
              <Menu.Item key="1">
                <Link to={{ pathname: `/homepage` }}>
                  <HomeFilled />
                  Home
                </Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to={{ pathname: `/products/` }}>
                  <SkinFilled />
                  Product
                </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to={{ pathname: `/store/` }}>
                  <ContainerFilled />
                  Stock
                </Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to={{ pathname: `/shop/` }}>
                  <DollarCircleFilled />
                  Shop
                </Link>
              </Menu.Item>
              <Menu.Item key="5">
                <Link to={{ pathname: `/reports/` }}>
                  <FundFilled />
                  Reports
                </Link>
              </Menu.Item>
              <Menu.Item key="6">
                <Link to={{ pathname: `/profile/` }}>
                  <ToolFilled />
                  Settings
                </Link>
              </Menu.Item>
              <Menu.Item style={{ marginTop: 60 }} key="7">
                <a href="/login" onClick={this.logOut}>
                  <LogoutOutlined />
                  Logout
                </a>
              </Menu.Item>
            </Menu>
          </Sider>
        ) : (
          <></>
        )}
      </>
    );
  }
}
