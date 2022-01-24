import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Avatar,
  Row,
  Col,
  Image,
  Button,
  Space,
  Radio,
  Typography,
} from "antd";

import { PlusOutlined } from "@ant-design/icons";

import productimg from "../assets/product-img-1.jpg";

const { Title, Text } = Typography;

class ProductCardItem extends Component {
  state = { color: null, size: null, barcode: null };

  addProductToCart = (e) => {
    e.preventDefault();
    const size = this.state.size ? this.state.size : 1;
    const color = this.state.color ? this.state.color : 1;

    this.props.addProductToCart(this.props.product, size, color);
  };
  handleSizeChange = (e) => {
    this.setState({
      size: e.target.value,
    });
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
                onClick={this.addProductToCart}
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

export default ProductCardItem;
