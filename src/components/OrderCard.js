import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { CloseCircleFilled, EditFilled } from "@ant-design/icons";
import {
  Card,
  message,
  Avatar,
  Divider,
  Tooltip,
  Modal,
  Button,
  Steps,
} from "antd";
import { ORDER_ENDPOINT } from "../helpers/endpoints.js";
import axios from "axios";
import Moment from "moment";

const { Step } = Steps;

export default class OrderCard extends React.Component {
  static propTypes = {
    order: PropTypes.object,
  };

  state = {
    loading: false,
    visible: false,
    current: 0,
    status: null,
  };
  getStatus = (status) => {
    if (status == "delievered") {
      this.setState({ current: 2 });
    } else if (status == "dispatched") {
      this.setState({ current: 1 });
    } else {
      this.setState({ current: 0 });
    }
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    const id = this.props.order.id;
    let data = {
      status: this.state.status,
    };
    const endpoint = ORDER_ENDPOINT + id + "/";
    axios.put(endpoint, data).then((resp) => {
      message.info("Order Status Updated Successfully!");
      this.setState({
        visible: false,
        loading: false,
      });
      //window.location.reload();
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  onStepChange = (current) => {
    let cstatus = null;
    if (current == 1) {
      cstatus = "dispatched";
    } else if (current == 2) {
      cstatus = "delievered";
    } else {
      cstatus = "processing";
    }
    this.setState({ current, status: cstatus });
  };

  handleCloseOrder = () => {
    let data = {
      status: "delivered",
    };
    const endpoint = ORDER_ENDPOINT + this.props.order.id + "/";
    console.log(endpoint);
    axios.put(endpoint, data).then((resp) => {
      message.info("Order Closed Successfully!");
    });
  };

  componentDidMount() {
    const { status } = this.props.order;
    this.getStatus(status);
  }
  render() {
    const { order } = this.props;
    const { visible, loading } = this.state;

    const { current } = this.state;

    const orderInfo = (
      <span style={{ fontSize: 10 }}>
        Order No:{order.id} <br />
        Date:{Moment(order.created).format("MM/DD/YYYY")}
        <br />
        Amount:{order.get_total_cost}
      </span>
    );

    const updateInfo = (
      <span style={{ fontSize: 10 }}>
        Last Updated:{Moment(order.updated).format("MM/DD/YYYY")}
      </span>
    );

    const addressInfo = (
      <span style={{ fontSize: 10 }}>
        Contact No:{order.phone} <br />
        Address:{order.address}
      </span>
    );
    return (
      <>
        {order.status != "delivered" ? (
          <Card
            size="small"
            bordered={false}
            style={{
              backgroundColor: "#1d1a1d",
              borderBottomRightRadius: 8,
              borderBottomLeftRadius: 8,
              borderTopRightRadius: 8,
              borderTopLeftRadius: 8,
              marginRight: 10,
              marginBottom: 10,
            }}
            className="card-shadow"
          >
            <div style={{ textAlign: "center" }}>
              <Link
                to={{
                  pathname: `/order/${order.id}/`,
                  state: { order },
                }}
              >
                <Divider style={{ margin: 0, marginBottom: 10 }}>
                  <Avatar
                    size={28}
                    style={{
                      color: "#242224",
                      backgroundColor: "#64395e",
                    }}
                  >
                    {order.id}
                  </Avatar>
                </Divider>
                <div>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      color: "#707070",
                    }}
                  >
                    &#8377;{order.get_total_cost}
                  </span>{" "}
                  <br />
                  <span style={{ fontSize: 11, color: "#707070" }}>
                    {this.state.status ? this.state.status : order.status}
                  </span>
                </div>
              </Link>
            </div>
            <div
              style={{
                textAlign: "center",
              }}
            ></div>
            <div style={{ marginTop: 10, textAlign: "center" }}>
              <Tooltip placement="bottom" title="Update Status" color="#64395e">
                <EditFilled
                  style={{
                    fontSize: "18px",
                    color: "#64395e",
                    marginRight: 15,
                  }}
                  onClick={this.showModal}
                />
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip placement="bottom" title="Close" color="#64395e">
                <CloseCircleFilled
                  style={{ fontSize: "18px", color: "#64395e", marginLeft: 15 }}
                  onClick={this.handleCloseOrder}
                />
              </Tooltip>
            </div>

            <Modal
              visible={visible}
              title="Update Order Status"
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              width={600}
              footer={[
                <Button key="back" onClick={this.handleCancel}>
                  Return
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  loading={loading}
                  onClick={this.handleOk}
                >
                  Update
                </Button>,
              ]}
            >
              <Steps
                size="small"
                current={current}
                onChange={this.onStepChange}
              >
                <Step title="Processing" description={orderInfo} />
                <Step title="Dispatched" description={updateInfo} />
                <Step title="Delivered" description={addressInfo} />
              </Steps>
            </Modal>
          </Card>
        ) : (
          ""
        )}
      </>
    );
  }
}
