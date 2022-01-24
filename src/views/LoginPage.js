import React, { Component } from "react";

import { Row, Col, Card, Form, Input, Button, Avatar, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import AuthService from "../helpers/auth-service";
import loginCover from "../assets/login-cover.png";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.onFinish = this.onFinish.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: "",
      password: "",
      loading: false,
      message: "error",
    };
  }
  onChangeUsername(e) {
    this.setState({
      username: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }
  onFinish = (values) => {
    this.setState({
      message: "success",
      loading: true,
    });
    if (AuthService.login(values.username, values.password)) {
      this.props.history.push("/homepage");
      window.location.reload();
    } else {
      message.info("Incorrect Username or Password!!!");
    }
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  render() {
    return (
      <div
        className="card-shadow"
        style={{
          marginTop: 140,
          marginLeft: 180,
          marginRight: 180,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        <Row wrap={false}>
          <Col
            flex="480px"
            style={{
              textAlign: "center",
              backgroundColor: "#200F21",
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
            }}
          >
            <div style={{ marginTop: 90 }}>
              <img src={loginCover} alt="Mangala's Kitchen" />
            </div>
          </Col>
          <Col flex="auto">
            <Card
              style={{
                backgroundColor: "#242224",
                border: "none",
                borderBottomRightRadius: 8,
                borderTopRightRadius: 8,
                padding: 10,
              }}
            >
              <Avatar
                size={80}
                style={{ backgroundColor: "#200F21", marginBottom: 60 }}
                icon={<UserOutlined style={{ color: "#64395e" }} />}
              />
              <Form
                name="normal_login"
                initialValues={{ remember: true }}
                onFinish={this.onFinish}
              >
                <Form.Item
                  name="username"
                  hasFeedback
                  validateStatus={this.message}
                  rules={[
                    { required: true, message: "Please enter Username!" },
                  ]}
                >
                  <Input
                    style={{ borderColor: "#200F21" }}
                    prefix={<UserOutlined style={{ color: "#200F21" }} />}
                    placeholder="Username"
                    onChange={this.onChangeUsername}
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  hasFeedback
                  validateStatus={this.message}
                  rules={[
                    { required: true, message: "Please enter Password!" },
                  ]}
                >
                  <Input.Password
                    style={{ borderColor: "#200F21" }}
                    prefix={<LockOutlined style={{ color: "#200F21" }} />}
                    placeholder="Password"
                    onChange={this.onChangePassword}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    shape="round"
                    style={{
                      marginRight: 25,
                      color: "#707070",
                      backgroundColor: "#200F21",
                      borderColor: "#200F21",
                      paddingLeft: 40,
                      paddingRight: 40,
                    }}
                    type="primary"
                    htmlType="submit"
                  >
                    Log In
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
