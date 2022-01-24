import React from "react";
import PropTypes from "prop-types";
import ReactToPrint from "react-to-print";

import { Row, Col, List, Card, Button, Space } from "antd";
import { PlusOutlined, MinusOutlined, DeleteOutlined } from "@ant-design/icons";

import InfiniteScroll from "react-infinite-scroll-component";
import SearchFilterAdd from "../components/SearchFilterAdd.js";

import PrintBill from "./PrintBill.js";

const ButtonGroup = Button.Group;

export default class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      action: "",
      kot_counter: "",
    };
  }

  static propTypes = {
    handleProductActions: PropTypes.func,
    handleAddOrEditProduct: PropTypes.func,
    handleBack: PropTypes.func,
    order_items: PropTypes.array,
    changeQty: PropTypes.func.isRequired,
  };

  handleCloseKOT = () => {
    this.props.handleProductActions("CLOSE");
  };
  handleCloseOrder = () => {
    this.props.handleProductActions("SETTLE");
  };
  handleBack = () => {
    this.props.handleProductActions("BACK");
  };

  changeQty = (action, item_id) => {
    this.props.changeQty(action, item_id);
  };

  handleAddOrEditProduct = (menu_id, quantity) => {
    this.props.handleAddOrEditProduct(menu_id, quantity);
  };
  handleInfiniteOnLoad = () => {
    this.setState({
      loading: true,
    });
  };
  printWindow = () => {
    console.log("Print Window");
  };
  render() {
    const { order_items } = this.props;
    const { order_data } = this.props;

    return (
      <div>
        <Card>
          <SearchFilterAdd
            handleAddOrEditProduct={this.handleAddOrEditProduct}
            order_data={order_data}
          />
        </Card>
        <div className="item-infinite-container">
          <InfiniteScroll
            initialLoad={false}
            dataLength={order_items.length}
            pageStart={0}
            loadMore={this.handleInfiniteOnLoad}
            useWindow={false}
          >
            <List
              dataSource={order_items}
              renderItem={(item) => (
                <OrderItem item={item} changeQty={this.changeQty} />
              )}
            ></List>
          </InfiniteScroll>
        </div>
        <Card className="item-total-info">
          <Row>
            <Col span={6}>Order:</Col>
            <Col span={6}>{order_data.id}</Col>
            <Col span={6}>Total:</Col>
            <Col span={6}>{order_data.status}</Col>
          </Row>
        </Card>
        <Card style={{ marginTop: 20 }}>
          <div>
            <Space wrap>
              <ReactToPrint
                trigger={() => (
                  <Button style={{ width: 150 }} type="primary">
                    Print KOT
                  </Button>
                )}
                content={() => this.componentRef}
                onAfterPrint={this.handleCloseKOT}
              />
              <ReactToPrint
                trigger={() => (
                  <Button style={{ width: 150 }} type="primary">
                    SETTLE
                  </Button>
                )}
                content={() => this.componentRef}
                onAfterPrint={this.handleCloseOrder}
                removeAfterPrint
              />
              <Button
                style={{ width: 120 }}
                type="primary"
                onClick={this.handleBack}
                danger
              >
                Back{" "}
              </Button>
              <div style={{ overflow: "hidden", height: 0 }}>
                <PrintBill
                  order_data={order_data}
                  order_items={order_items}
                  ref={(el) => (this.componentRef = el)}
                />
              </div>
            </Space>
          </div>
        </Card>
      </div>
    );
  }
}

class OrderItem extends React.Component {
  static propTypes = {
    changeQty: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
  };

  addQty = () => {
    this.props.changeQty("ADD", this.props.item.id);
  };

  removeQty = () => {
    this.props.changeQty("REMOVE", this.props.item.id);
  };

  handleDeleteItem = () => {
    this.props.changeQty("DELETE", this.props.item.id);
  };

  render() {
    const item = this.props.item;
    return (
      <List.Item
        key={item.id}
        actions={[
          <ButtonGroup>
            <Button onClick={this.addQty}>
              <PlusOutlined />
            </Button>
            <Button onClick={this.removeQty}>
              <MinusOutlined />
            </Button>
            <Button onClick={this.handleDeleteItem}>
              <DeleteOutlined />
            </Button>
          </ButtonGroup>,
        ]}
      >
        <List.Item.Meta
          title={item.tag_menu_related}
          description={item.tag_total_value}
        />

        <div>
          {item.qty}
          <span> x </span>
          {item.tag_value}
        </div>
      </List.Item>
    );
  }
}
