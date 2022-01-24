import React from "react";

import { Row, message } from "antd";

import ProductCardItem from "./ProductCartItem";
import { connect } from "react-redux";

import { addToCart } from "../store/actions/cartAction";
import { fetchProducts } from "../store/actions/productAction";

import axios from "axios";
import { STOCK_ENDPOINT } from "../helpers/endpoints";

class ProductCards extends React.Component {
  addProductToCart = (product, size, color) => {
    this.props.addProductToCart(product, size, color);
  };

  getStockDetails(id, size) {
    const endpoint = STOCK_ENDPOINT + `?product=${id}&size=${size}`;
    try {
      axios
        .get(endpoint)
        .then((res) => {
          return res.data;
        })
        .then((response) => {
          if (response.length > 0) {
            this.setState({
              barcode: response[0].barcode,
            });
          } else {
            this.setState({
              barcode: null,
            });
          }
        });
    } catch (error) {
      console.log("error", error);
    }
  }

  componentDidMount() {
    this.props.fetchProducts();
  }
  render() {
    const { products } = this.props.products;

    return (
      <Row gutter={[16, 16]}>
        {products.map((product, index) => (
          <ProductCardItem
            product={product}
            key={index}
            addProductToCart={this.addProductToCart}
          />
        ))}
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    products: state.products,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    fetchProducts: () => dispatch(fetchProducts()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductCards);
