import React from "react";
import { Space, Avatar } from "antd";

export default class ReportTotalData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleForm: false,
    };
  }

  handleToggleForm = (e) => {
    e.preventDefault();
    this.setState({
      toggleForm: !this.state.toggleForm,
    });
  };

  render() {
    return (
      <>
        <Space>
          <Avatar
            className="card-shadow"
            size={60}
            style={{
              color: "#d0d0d0",
              fontWeight: "bold",
              backgroundColor: "#64395e",
            }}
          >
            {this.props.reports.count}
          </Avatar>
          <span>Order</span>
        </Space>
        <br />
        <Space style={{ marginTop: 32 }}>
          <span>Sale</span>
          <Avatar
            className="card-shadow"
            size={80}
            style={{
              color: "#d0d0d0",
              fontWeight: "bold",
              backgroundColor: "#64395e",
            }}
          >
            &#8377; {this.props.reports.total}
          </Avatar>
        </Space>
      </>
    );
  }
}
