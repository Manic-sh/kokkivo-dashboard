import React from "react";

import { withRouter } from "react-router-dom";

import { fetchData } from "../helpers/fetch-common.js";
import { PRODUCT_DETAIL_ENDPOINT } from "../helpers/endpoints";

import productsrc from "../assets/product/retro-thumb.png";

import { Card, Row, Col, Image, Typography, Radio, Tabs } from "antd";
import { SkinFilled, ScissorOutlined, ShoppingFilled } from "@ant-design/icons";

const { TabPane } = Tabs;

class ProductDetailCustomize extends React.Component {
  state = {
    product: [],
    current: 0,
  };
  getProductDetail(id) {
    const thisComp = this;
    const endpoint = PRODUCT_DETAIL_ENDPOINT + id + "/";
    fetchData(endpoint, thisComp, "product");
  }

  onChange = (current) => {
    console.log("onChange:", current);
    this.setState({ current });
  };

  handleChangeImage = ({ target: { value } }) => {
    console.log(value);
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    this.getProductDetail(id);
  }

  render() {
    console.log(this.state.product);
    return (
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Tabs size="large" defaultActiveKey="0" centered>
            <TabPane
              tab={
                <span>
                  <SkinFilled />
                  Build It
                </span>
              }
              key="1"
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Image.PreviewGroup>
                    <Image width={450} src={productsrc} />
                  </Image.PreviewGroup>
                </Col>
                <Col span={24}>
                  <Radio.Group
                    onChange={this.handleChangeImage}
                    value={this.dotPosition}
                    style={{ marginBottom: 8 }}
                  >
                    <Radio.Button value="top">Top</Radio.Button>
                    <Radio.Button value="bottom">Bottom</Radio.Button>
                    <Radio.Button value="left">Left</Radio.Button>
                    <Radio.Button value="right">Right</Radio.Button>
                  </Radio.Group>
                </Col>
              </Row>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <ScissorOutlined />
                  Personalized It
                </span>
              }
              key="2"
            >
              Tab 2
            </TabPane>
            <TabPane
              tab={
                <span>
                  <ShoppingFilled />
                  Add To Cart
                </span>
              }
              key="3"
            >
              Tab 3
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    );
  }
}
export default withRouter(ProductDetailCustomize);
