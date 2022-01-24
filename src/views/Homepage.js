import React from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { Button, Card, Row, Affix, Divider } from "antd";
import OrderCard from "../components/OrderCard.js";
import { fetchData } from "../helpers/fetch-common.js";
import { ORDERS_ENDPOINT } from "../helpers/endpoints.js";
import axios from "axios";

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      doneLoading: false,
      order: undefined,
    };
  }

  getOrders() {
    const thisComp = this;
    fetchData(ORDERS_ENDPOINT, thisComp, "orders", true);
  }

  updateOrders = () => {
    this.getOrders();
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const newOrder = {
      status: "processing",
    };
    try {
      axios.post(ORDERS_ENDPOINT, newOrder).then((response) => {
        const new_order_id = response.data.id;
        const new_url = `/order/${new_order_id}/`;
        this.props.history.push(new_url);
      });
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this.getOrders();
    //setInterval(this.updateOrders, 1000);
  }

  render() {
    const doneLoading = this.state.doneLoading;
    const orders = this.state.orders;
    return (
      <div
        style={{
          margin: 20,
        }}
      >
        <Card
          key={1}
          style={{
            backgroundColor: "#242224",
            border: "none",
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 8,
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
            padding: 10,
          }}
          className="card-shadow"
        >
          {doneLoading !== false ? (
            <MyContainer key={323} orders={orders} />
          ) : (
            <p>No data</p>
          )}
        </Card>
        <div style={{ marginTop: 20 }}>
          <Divider>
            <Affix offsetTop={100}>
              <Link to="/shop/">
                <Button
                  type="primary"
                  shape="round"
                  style={{
                    color: "#707070",
                    backgroundColor: "#200F21",
                    borderColor: "#200F21",
                  }}
                >
                  New Order
                </Button>
              </Link>
            </Affix>
          </Divider>
        </div>
      </div>
    );
  }
}

class MyContainer extends React.Component {
  static propTypes = {
    orders: PropTypes.array,
  };

  render() {
    const { orders } = this.props;
    return (
      <div>
        <Row>
          {orders.map((order, index) => (
            <OrderCard key={index} order={order} />
          ))}
        </Row>
      </div>
    );
  }
}

export default withRouter(Homepage);
