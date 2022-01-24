import React from "react";

import { List, Button, Avatar } from "antd";
import { PlusOutlined, MinusOutlined, DeleteOutlined } from "@ant-design/icons";

import * as cartActions from "../store/actions/cartAction";
import { connect } from "react-redux";

const ButtonGroup = Button.Group;

class OrderItem extends React.Component {
  addQty = () => {
    const item = this.props.item;
    console.log(item);
    this.props.addQuantity(item.product.id, item.size, item.color);
  };

  removeQty = () => {
    const item = this.props.item;
    this.props.subtractQuantity(item.product.id, item.size, item.color);
  };

  handleDeleteItem = () => {
    const item = this.props.item;
    this.props.removeFromCart(item.product.id, item.size, item.color);
  };

  render() {
    const { item } = this.props;
    const quantity = "x " + item.quantity;
    return (
      <List.Item
        style={{ fontSize: 10 }}
        key={item.id}
        actions={[
          <ButtonGroup size="small">
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
          avatar={
            <Avatar
              shape="square"
              size="large"
              src="https://joeschmoe.io/api/v1/random"
            />
          }
          title={item.product.name}
          description={quantity}
        />
        <div>{item.product.price}</div>
      </List.Item>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    subtractQuantity: (product_id, size, color) => {
      dispatch(cartActions.subtractQuantity(product_id, size, color));
    },
    addQuantity: (product_id, size, color) => {
      dispatch(cartActions.addQuantity(product_id, size, color));
    },
    removeFromCart: (product_id, size, color) => {
      dispatch(cartActions.removeFromCart(product_id, size, color));
    },
  };
};

export default connect(null, mapDispatchToProps)(OrderItem);
