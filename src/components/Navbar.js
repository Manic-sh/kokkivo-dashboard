import React from "react";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";

import { Menu, Dropdown, Row, Col, Badge } from "antd";
import {
  UserOutlined,
  CoffeeOutlined,
  ShoppingOutlined,
  MobileOutlined,
} from "@ant-design/icons";
import AuthService from "../helpers/auth-service";

export default class MyNavbar extends React.Component {
  state = {
    countDelivery: 0,
    countDining: 0,
    countApp: 0,
    show: true,
  };

  logOut() {
    AuthService.logout();
  }

  render() {
    let currentUser = AuthService.userLoggedIn();

    const menu = (
      <Menu>
        <Menu.Item key="1">
          <Link
            to={{
              pathname: `/homepage`,
            }}
          >
            Home Page
          </Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link
            to={{
              pathname: `/reports/`,
            }}
          >
            Reports
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link
            to={{
              pathname: `/products/`,
            }}
          >
            {" "}
            Products
          </Link>
        </Menu.Item>
        <Menu.Item key="5">
          <Link
            to={{
              pathname: `/store/`,
            }}
          >
            {" "}
            Product Store
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <a href="/login" onClick={this.logOut}>
            {" "}
            Logout{" "}
          </a>
        </Menu.Item>
      </Menu>
    );

    return (
      <>
        {currentUser ? (
          <>
            <Row>
              <div className="logo" />
              <Col flex="auto"></Col>
              <Col flex="200px">
                <Dropdown.Button
                  style={{ float: "right", paddingTop: 20 }}
                  overlay={menu}
                  placement="bottomCenter"
                  icon={<UserOutlined />}
                >
                  {currentUser}
                </Dropdown.Button>
              </Col>
            </Row>
          </>
        ) : (
          <></>
        )}
      </>
    );
  }
}
