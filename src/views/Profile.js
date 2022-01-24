import React, { Component } from "react";
import { Result, Button } from "antd";

export default class Profile extends Component {
  render() {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist or Under Construction."
        extra={
          <Button type="primary">
            <a href="/homepage">Back Home</a>
          </Button>
        }
      />
    );
  }
}
