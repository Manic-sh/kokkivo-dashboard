import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { STOCK_ENDPOINT } from "../helpers/endpoints";

import axios from "axios";

import {
  Card,
  Avatar,
  Row,
  Col,
  Image,
  Typography,
  Button,
  Space,
  message,
  Radio,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import productimg from "../assets/product-img-1.jpg";

const { Title, Text } = Typography;

export default class ProductCards extends React.Component {
  static propTypes = {
    products: PropTypes.array.isRequired,
    handleAddOrEditProduct: PropTypes.func.isRequired,
  };
  handleAddOrEditProduct = (product, size, color) => {
    this.props.handleAddOrEditProduct(product, size, color);
  };

  render() {
    const { products } = this.props;
    return (
      <ProductCard
        products={products}
        handleAddOrEditProduct={this.handleAddOrEditProduct}
      />
    );
  }
}
class ProductCard extends React.Component {
  static propTypes = {
    products: PropTypes.array.isRequired,
    handleAddOrEditProduct: PropTypes.func.isRequired,
  };

  handleAddOrEditProduct = (product, size, color) => {
    this.props.handleAddOrEditProduct(product, size, color);
  };

  render() {
    const products = this.props.products;
    return (
      <Row gutter={[16, 16]}>
        {products.map((product, index) => (
          <ProductCardItem
            key={index}
            product={product}
            handleAddOrEditProduct={this.handleAddOrEditProduct}
          />
        ))}
      </Row>
    );
  }
}

class ProductCardItem extends React.Component {
  state = { color: null, size: null, barcode: null };
  static propTypes = {
    handleAddOrEditProduct: PropTypes.func.isRequired,
    product: PropTypes.object.isRequired,
  };

  addProduct = () => {
    const size = this.state.size;
    const color = this.state.color ? this.state.color : 1;
    if (size !== null) {
      if (this.state.barcode != null) {
        let cart = [];
        let updated = false;

        if (localStorage.getItem("cart")) {
          cart = JSON.parse(localStorage.getItem("cart"));
        }
        if (!updated) {
          cart.push({
            product: this.props.product,
            size: size,
            color: color,
            quantity: 1,
          });
        }
        this.props.handleAddOrEditProduct(this.props.product, size, color);
      } else {
        message.error("Product size or color not available in stock!!!");
      }
    } else {
      message.error("Select Size and Color");
    }
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

  handleSizeChange = (e) => {
    this.setState({
      size: e.target.value,
    });
    this.getStockDetails(this.props.product.id, e.target.value);
  };

  handleColorChange = (e) => {
    this.setState({
      color: e.target.value,
    });
  };

  render() {
    const { product } = this.props;
    return (
      <Col span={8}>
        <Card
          size="small"
          bordered={false}
          hoverable
          style={{ borderRadius: 15 }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Image
                width={80}
                src={productimg}
                style={{ borderRadius: 15 }}
                preview={{
                  src: this.state.barcode ? this.state.barcode : productimg,
                }}
              />
            </Col>
            <Col span={16}>
              <Title level={5}>{product.name}</Title>
              <Text type="secondary">{product.description}</Text>
              <Title level={5}>
                <span>&#8377; </span>
                {product.price}
              </Title>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Space direction="vertical">
                <Text strong>Size</Text>
                <Radio.Group
                  size="small"
                  buttonStyle="solid"
                  onChange={this.handleSizeChange}
                >
                  {product.size.map((sizes, index) => (
                    <Radio.Button
                      value={sizes.id}
                      key={index}
                      style={{ fontSize: 10 }}
                      disabled={this.handleCheckStock}
                    >
                      {sizes.size.replace(/[a-zA-Z]/g, "")}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Space>
            </Col>
            <Col span={24}>
              <Space direction="vertical">
                <Text strong>Color</Text>
                <Radio.Group
                  size="small"
                  buttonStyle="solid"
                  onChange={this.handleColorChange}
                >
                  {product.color.map((colors, index) => (
                    <Radio.Button value={colors.id} key={index}>
                      <Avatar
                        shape="rounded"
                        size={14}
                        style={{ backgroundColor: colors.color }}
                      />
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Space>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 20 }}>
            <Col span={12}>
              <Button
                type="link"
                size="small"
                style={{
                  height: 40,
                  border: "1px solid ",
                }}
                block
              >
                <Link to={`/ProductCustomize/${product.id}/`}>Customize</Link>
              </Button>
            </Col>
            <Col span={12}>
              <Button
                type="primary"
                size="small"
                icon={<PlusOutlined />}
                style={{ height: 40 }}
                onClick={this.addProduct}
                block
              >
                Add
              </Button>
            </Col>
          </Row>
        </Card>
      </Col>
    );
  }
}
