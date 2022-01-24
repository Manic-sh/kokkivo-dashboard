import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import OrderItem from "../components/OrderItem.js";

import { Row, Col, List, Typography } from "antd";

const { Text } = Typography;

class Cart extends Component {
  getSubTotal() {
    return this.props.cart.reduce(
      (total, item) => total + parseInt(item.product.price * item.quantity, 10),
      0
    );
  }

  getTax(total) {
    return (total * 12) / 100;
  }

  getTotal() {
    const subtotal = this.getSubTotal();
    const tax = this.getTax(subtotal);
    return subtotal + tax;
  }

  render() {
    const { cart } = this.props;

    return (
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <InfiniteScroll
            initialLoad={false}
            dataLength={cart.length}
            pageStart={0}
            loadMore={this.handleInfiniteOnLoad}
            useWindow={false}
            height={300}
          >
            <List
              dataSource={cart}
              renderItem={(item) => <OrderItem item={item} />}
            ></List>
          </InfiniteScroll>
        </Col>
        <Col span={24}>
          <Row>
            <Col span={12}>
              <Text style={{ fontSize: 12, fontWeight: "bold" }}>SubTotal</Text>
            </Col>
            <Col
              span={12}
              style={{
                fontSize: 12,
                fontWeight: "bold",
                textAlign: "end",
              }}
            >
              <Text>{this.getSubTotal()}</Text>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Text style={{ fontSize: 10 }}>Tax (12%)</Text>
            </Col>
            <Col
              span={12}
              style={{
                fontSize: 10,
                textAlign: "end",
              }}
            >
              <Text style={{ fontSize: 10 }}>
                {this.getTax(this.getSubTotal())}
              </Text>
            </Col>
          </Row>
          <hr className="hr-line" />
          <Row>
            <Col span={12}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>Total</Text>
            </Col>
            <Col
              span={12}
              style={{
                fontSize: 14,
                fontWeight: "bold",
                textAlign: "end",
              }}
            >
              <Text>{this.getTotal()}</Text>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
export default Cart;
