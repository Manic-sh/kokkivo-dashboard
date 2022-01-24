import React from "react";
import { withRouter } from "react-router-dom";

import {
  Row,
  Col,
  Layout,
  Typography,
  List,
  Card,
  Button,
  Avatar,
  Space,
  Badge,
  Radio,
  Modal,
  Form,
  Input,
  Select,
  message,
} from "antd";
import {
  BellFilled,
  WalletOutlined,
  CreditCardOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import SearchFilterAdd from "../components/SearchFilterAdd.js";

import { connect } from "react-redux";

import { emptyCart, addToCart } from "../store/actions/cartAction";

import {
  PRODUCT_ENDPOINT,
  CATEGORYS_ENDPOINT,
  SUBCATEGORY_ENDPOINT,
  ORDERS_ENDPOINT,
  PAYMENT_DETAILS,
} from "../helpers/endpoints.js";
import {
  fetchData,
  postQtyChange,
  addOrEditProduct,
} from "../helpers/fetch-common.js";

import ProductCards from "../components/ProductCard.js";
import CategoryCard from "../components/CategoryItemCard";
import Cart from "../components/Cart";
const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

class Shop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      subcategories: [],
      doneLoading: false,
      new_order: false,
      show: true,
      paymode: "",
      modalCheckoutVisible: false,
      updateCart: false,
    };
  }

  getCategories(endpoint) {
    const thisComp = this;
    fetchData(endpoint, thisComp, "categories");
  }
  getSubCategories() {
    const thisComp = this;
    fetchData(SUBCATEGORY_ENDPOINT, thisComp, "subcategories");
  }
  getCartItems() {
    if (localStorage.getItem("cart")) {
      this.setState({ cart: JSON.parse(localStorage.getItem("cart")) });
    }
  }

  handleSelectedCategories = (categories) => {
    if (categories !== 5) {
      const endpoint = PRODUCT_ENDPOINT + "?category=" + categories;
      //this.getProducts(endpoint);
      message.success("Under Modification");
    } else {
      message.success("Under Modification");
      //this.getProducts(PRODUCT_ENDPOINT);
    }
  };

  handleSelectedSubCategories = (subcategories) => {
    if (subcategories !== 5) {
      message.success("Under Modification");
      const endpoint = PRODUCT_ENDPOINT + "?subcategory=" + subcategories;
      //this.getProducts(endpoint);
    } else {
      message.success("Under Work");
    }
  };

  handleClearFilters = () => {
    const endpoint = PRODUCT_ENDPOINT;
    this.getProducts(endpoint);
  };

  changeQty = (action, item_id, size) => {
    let cart = [...this.state.cart];
    const thisComp = this;
    switch (action) {
      case "ADD":
        postQtyChange("ADD", item_id, size, thisComp);
        cart.forEach((element) => {
          if (element.product.id == item_id && element.size == size) {
            element.quantity = element.quantity + 1;
          }
        });
        this.setState({ cart: cart });
        //localStorage.setItem("cart", JSON.stringify(cart));
        break;
      case "REMOVE":
        cart.forEach((element) => {
          if (element.product.id == item_id && element.size == size) {
            if (element.quantity - 1 > 0) {
              element.quantity = element.quantity - 1;
            }
          }
        });
        postQtyChange("REMOVE", item_id, size, thisComp);
        this.setState({ cart: cart });
        //localStorage.setItem("cart", JSON.stringify(cart));
        break;
      case "DELETE":
        postQtyChange("DELETE", item_id, size, thisComp, cart.quantity);

        for (var i = 0; i < cart.length; i++) {
          if ((cart[i].product.id === item_id) & (cart[i].size === size)) {
            cart.splice(i, 1);
          }
        }
        const filteredItems = cart.filter(
          (item) => item.product.id !== item_id
        );
        this.setState({ cart: cart });
        //localStorage.setItem("cart", JSON.stringify(filteredItems));
        break;
      default:
        this.setState({ cart: cart });
    }
  };

  addProductToCart = (product, size, color) => {
    this.setState({
      updateCart: true,
    });
    this.props.addToCart(product, size, color);
  };

  onPaymentChange = (e) => {
    this.setState({
      paymode: e.target.value,
    });
  };

  setCheckoutModalVisible = (show) => {
    this.setState({ modalCheckoutVisible: show });
  };

  handleCheckout = () => {
    this.setState({ modalCheckoutVisible: true });
  };

  onFinish = (values) => {
    const data = {
      name: values.name,
      address: values.address.street,
      city: values.address.city,
      postcode: values.postcode,
      phone: values.phone,
      status: "processing",
    };

    try {
      axios
        .post(ORDERS_ENDPOINT, data)
        .then((res) => {
          return res.data;
        })
        .then((resp) => {
          console.log(resp.id);
          const order_id = resp.id;
          this.props.cart.forEach((item) => {
            addOrEditProduct(
              order_id,
              item.product.id,
              item.size,
              item.color,
              item.product.price,
              item.quantity
            );
          });
          let paymentData = {
            order: order_id,
            paymode: this.state.paymode,
            paystatus: "completed",
          };
          axios.post(PAYMENT_DETAILS, paymentData).then((response) => {
            return response.data;
          });
        });
      this.props.emptyCart();
    } catch (error) {}
    message.success("Order Placed Successfully");
    this.setState({ modalCheckoutVisible: false });
  };

  componentDidMount() {
    this.getCategories(CATEGORYS_ENDPOINT);
    this.getSubCategories();
    this.getCartItems();
  }
  render() {
    const { categories, subcategories } = this.state;
    const { cart } = this.props;
    return (
      <>
        <Layout style={{ padding: 0, marginRight: 16 }}>
          <Content
            style={{
              backgroundColor: "#",
              marginRight: 380,
            }}
          >
            <Row>
              <Col span={12}>
                <Title level={5}>Choose Category</Title>
                <CategoryCard
                  categories={categories}
                  handleFilterProduct={this.handleSelectedCategories}
                />
              </Col>
              <Col span={12}>
                <Title level={5}>Choose Sub Category</Title>
                <CategoryCard
                  categories={subcategories}
                  handleFilterProduct={this.handleSelectedSubCategories}
                />
              </Col>
            </Row>
            <Row>
              <Col span={12} style={{ paddingTop: 40, paddingBottom: 20 }}>
                <Title level={5}>Products</Title>
              </Col>
              <Col
                span={12}
                style={{ paddingTop: 20, paddingBottom: 20, right: -40 }}
              >
                <SearchFilterAdd />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div className="product-cards">
                  <ProductCards addProductToCart={this.addProductToCart} />
                </div>
              </Col>
            </Row>
          </Content>
          <Sider width="380px" className="right-sider-layout">
            <Card
              className="card-shadow"
              bordered={false}
              style={{ height: 60, padding: 0 }}
            >
              <Row style={{ margin: 14 }}>
                <Col span={16}>
                  <Space>
                    <Avatar src="https://joeschmoe.io/api/v1/random" />
                    <span>
                      <b>Kokkivo</b>
                    </span>
                    <Text type="secondary">I'm Admin</Text>
                  </Space>
                </Col>
                <Col span={8} style={{ textAlign: "end" }}>
                  <Badge dot={this.state.show}>
                    <Avatar icon={<BellFilled />} />
                  </Badge>
                </Col>
              </Row>
            </Card>
            <Row gutter={16}>
              <Col span={24} style={{ marginTop: 25 }}>
                <Row>
                  <Col flex="100px">
                    <Title level={5}>Bills</Title>
                  </Col>
                  <Col flex="auto" style={{ textAlign: "right" }}>
                    <Button
                      type="primary"
                      size="small"
                      danger
                      onClick={this.props.emptyCart}
                      disabled={this.props.cart.length ? false : true}
                    >
                      Empty Cart
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Cart cart={this.props.cart} />
            <Row gutter={16} style={{ marginTop: 30 }}>
              <Col span={24}>
                <Title level={5}>Payment Method</Title>
                <Radio.Group
                  defaultValue="1"
                  size="large"
                  buttonStyle="solid"
                  onChange={this.onPaymentChange}
                >
                  <Radio.Button value="1">
                    <DollarCircleOutlined
                      style={{ padding: 10, paddingRight: 18 }}
                    />
                    Cash
                  </Radio.Button>
                  <Radio.Button value="2">
                    <CreditCardOutlined
                      style={{ padding: 10, paddingRight: 18 }}
                    />
                    Card
                  </Radio.Button>
                  <Radio.Button value="3">
                    <WalletOutlined style={{ padding: 10, paddingRight: 18 }} />
                    Wallet
                  </Radio.Button>
                </Radio.Group>
              </Col>
              <Col span={24} style={{ marginTop: 40 }}>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={this.handleCheckout}
                  disabled={this.props.cart.length ? false : true}
                >
                  Checkout
                </Button>
              </Col>
            </Row>
            <Modal
              title="Address Modal"
              centered
              visible={this.state.modalCheckoutVisible}
              okButtonProps={{
                form: "checkout-form",
                key: "submit",
                htmlType: "submit",
              }}
              onCancel={() => this.setCheckoutModalVisible(false)}
            >
              <Form
                name="checkout-form"
                size="middle"
                layout="horizontal"
                onFinish={this.onFinish}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Form.Item
                  name={["user", "name"]}
                  label="Name"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Address">
                  <Input.Group compact>
                    <Form.Item
                      name={["address", "city"]}
                      noStyle
                      rules={[{ required: true, message: "City is required" }]}
                    >
                      <Select
                        placeholder="Select City"
                        style={{ width: "35%" }}
                      >
                        <Option value="Ganktok">Ganktok</Option>
                        <Option value="Siliguri">Siliguri</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name={["address", "street"]}
                      noStyle
                      rules={[
                        { required: true, message: "Street is required" },
                      ]}
                    >
                      <Input
                        style={{ width: "65%" }}
                        placeholder="Input street"
                      />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[
                    {
                      required: true,
                      message: "Please input your phone number!",
                    },
                  ]}
                >
                  <Input addonBefore="+91" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                  name="postcode"
                  label="PostCode"
                  rules={[
                    {
                      required: true,
                      message: "Please input your postcode!",
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              </Form>
            </Modal>
          </Sider>
        </Layout>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart.cart,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    emptyCart: () => dispatch(emptyCart()),
    addToCart: (product, size, color) => {
      dispatch(addToCart(product, size, color));
    },
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Shop));
