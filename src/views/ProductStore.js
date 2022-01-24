import React from "react";
import { withRouter } from "react-router-dom";

import {
  Card,
  Row,
  Col,
  Table,
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Upload,
  message,
  Divider,
  Space,
  Tag,
  Popconfirm,
} from "antd";
import {
  PRODUCT_ENDPOINT,
  SIZE_ENDPOINT,
  COLOR_ENDPOINT,
  STOCK_ENDPOINT,
  STOCK_DETAIL_ENDPOINT,
} from "../helpers/endpoints.js";
import { fetchData } from "../helpers/fetch-common.js";

import { UploadOutlined, ShoppingOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";
import axios from "axios";

const { Option } = Select;
const { Search } = Input;

class ProductStore extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();

    this.state = {
      products: [],
      sizes: [],
      colors: [],
      store: [],
      doneLoading: false,
      selectedRowKeys: undefined,
      drawerVisible: false,
      editAction: false,
      filterTable: null,
      btnText: "Add",
    };
  }

  getProducts(endpoint) {
    const thisComp = this;
    fetchData(endpoint, thisComp, "products", true);
  }
  getSizes() {
    const thisComp = this;
    fetchData(SIZE_ENDPOINT, thisComp, "sizes");
  }
  getColors() {
    const thisComp = this;
    fetchData(COLOR_ENDPOINT, thisComp, "colors");
  }
  getStock() {
    const thisComp = this;
    fetchData(STOCK_ENDPOINT, thisComp, "store");
  }

  handleChangeName = (e) => {
    this.setState({
      slug: e.target.value,
    });
  };
  onReset = () => {
    this.formRef.current.resetFields();
    this.setState({
      editAction: false,
    });
  };
  onFinish = (values) => {
    if (this.state.editAction) {
      const id = this.state.selectedRowKeys[0];
      const endpoint = STOCK_DETAIL_ENDPOINT + `${id}/`;
      console.log(values);
      let data = [...this.state.store];
      let index = data.findIndex((eid) => eid.id == id);
      try {
        axios.put(endpoint, values).then((res) => {
          message.success("Stock Edited Successfully");
          this.formRef.current.resetFields();
          data[index] = res.data;
          if (this.state.filterTable) {
            this.setState({
              filterTable: data,
              editAction: false,
              btnText: "Add",
            });
          }
          this.setState({
            store: data,
            editAction: false,
          });
        });
      } catch (error) {
        console.log("Error ", error);
      }
    } else {
      try {
        console.log(values);
        axios.post(STOCK_ENDPOINT, values).then((res) => {
          message.success("Product Added to Store Successfully");
          if (this.state.filterTable) {
            this.setState((state) => ({
              filterTable: [...state.filterTable, res.data],
            }));
          } else {
            this.setState((state) => ({
              store: [...state.store, res.data],
            }));
          }
          this.formRef.current.resetFields();
        });
      } catch (error) {
        console.log("Error ", error);
      }
    }
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };
  handleEditStock = () => {
    const id = this.state.selectedRowKeys[0];
    const endpoint = STOCK_DETAIL_ENDPOINT + `${id}/`;
    try {
      axios.get(endpoint).then((res) => {
        console.log(res.data);
        this.formRef.current.setFieldsValue({
          product: res.data.product,
          size: res.data.size,
          color: res.data.color,
          amount: res.data.amount,
          quantity: res.data.quantity,
        });
        this.setState({ editAction: true, btnText: "Update" });
      });
    } catch (error) {
      console.log(error);
    }
  };
  handleDeleteStock = () => {
    const id = this.state.selectedRowKeys[0];
    const endpoint = STOCK_DETAIL_ENDPOINT + `${id}/`;
    try {
      axios.delete(endpoint).then((res) => {
        this.setState({ selectedRowKeys: undefined, editAction: false });
        message.success("Stock Removed Successfully");
        if (this.state.filterTable) {
          const fitem = this.state.filterTable.filter((item) => item.id !== id);
          this.setState({
            filterTable: fitem,
            selectedRowKeys: undefined,
            editAction: false,
          });
        }
        const items = this.state.store.filter((item) => item.id !== id);
        this.setState({
          store: items,
          selectedRowKeys: undefined,
          editAction: false,
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  handleClearSelection = () => {
    this.setState({ selectedRowKeys: undefined });
    console.log("Clear Selection");
  };

  handleStoreSearch = (value) => {
    const { store } = this.state;
    const filterTable = store.filter((item) =>
      Object.keys(item).some((k) =>
        String(item[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    this.setState({ filterTable });
  };

  handleReset = () => {
    this.setState({
      filterTable: null,
      editAction: false,
      selectedRowKeys: undefined,
    });
  };

  componentDidMount() {
    this.getProducts(PRODUCT_ENDPOINT);
    this.getSizes();
    this.getColors();
    this.getStock();
  }

  render() {
    const { selectedRowKeys } = this.state;
    const { products, store, filterTable } = this.state;
    const storeTotal = store.reduce(
      (amount, item) => amount + parseInt(item.amount * item.quantity, 10),
      0
    );

    const productOptions = this.state.products.map((product) => (
      <Option key={product.id} value={product.id}>
        <span>{product.name}</span>
      </Option>
    ));

    const sizeOptions = this.state.sizes.map((size) => (
      <Option key={size.id} value={size.id}>
        <span>{size.size}</span>
      </Option>
    ));

    const colorOptions = this.state.colors.map((color) => (
      <Option key={color.id} value={color.id}>
        <span>{color.color}</span>
      </Option>
    ));

    const props = {
      name: "file",
      action: "http://localhost:3000/public/",
      headers: {
        authorization: "authorization-text",
      },
      onChange(info) {
        if (info.file.status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === "done") {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
      progress: {
        strokeColor: {
          "0%": "#108ee9",
          "100%": "#87d068",
        },
        strokeWidth: 3,
        format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
      },
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        title: "Name",
        dataIndex: "tag_product",
        width: 160,
      },
      {
        title: "Size",
        dataIndex: "tag_size",
        width: 60,
      },
      {
        title: "Color",
        dataIndex: "tag_color",
        width: 100,
      },
      {
        title: "Price",
        dataIndex: "amount",
        width: 100,
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        width: 100,
      },
      {
        title: "Barcode",
        dataIndex: "barcode",
        width: 250,
        render: (text) => <a href={text}>{text}</a>,
      },
    ];
    const hasSelected = selectedRowKeys;
    return (
      <Row style={{ backgroundColor: "#1d1a1d" }}>
        <Col sm={4} md={8} lg={8} style={{ padding: 15 }}>
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Card
                className="card-shadow"
                size="small"
                bordered={false}
                hoverable={true}
                style={{
                  textAlign: "center",
                  backgroundColor: "#242224",
                  borderRadius: 20,
                }}
              >
                <ShoppingOutlined style={{ fontSize: 32, color: "#64395e" }} />
                <br />
                Stock
                <Divider>{this.state.store.length}</Divider>
              </Card>
            </Col>
            <Col span={12}>
              <Card
                className="card-shadow"
                size="small"
                bordered={false}
                hoverable={true}
                style={{
                  textAlign: "center",
                  backgroundColor: "#242224",
                  borderRadius: 20,
                }}
              >
                <ShoppingOutlined style={{ fontSize: 32, color: "#64395e" }} />
                <br />
                Total Value
                <Divider>{storeTotal}</Divider>
              </Card>
            </Col>
          </Row>
          <Row gutter={[24, 24]} style={{ padding: 15, marginTop: 15 }}>
            <Col
              className="card-shadow"
              span={24}
              style={{ backgroundColor: "#242224", borderRadius: 10 }}
            >
              <Form
                size="small"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                style={{ padding: 15, fontStyle: "#d0d0d0", marginTop: 20 }}
                ref={this.formRef}
                name="control-ref"
                onFinish={this.onFinish}
              >
                <Form.Item
                  name="product"
                  label="Product"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Select Product"
                    onChange={this.handleProductChange}
                    allowClear
                  >
                    {productOptions}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="size"
                  label="Size"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Select Size"
                    onChange={this.handleChangeSize}
                    allowClear
                  >
                    {sizeOptions}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="color"
                  label="Color"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Select Color"
                    onChange={this.handleChangeColor}
                    allowClear
                  >
                    {colorOptions}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="amount"
                  label="Price"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1} />
                </Form.Item>
                <Form.Item
                  name="quantity"
                  label="Quantity"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1} />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 16, offset: 6 }}>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      shape="round"
                      style={{
                        color: "#d0d0d0",
                        backgroundColor: "#64395e",
                        borderColor: "#64395e",
                      }}
                    >
                      {this.state.btnText}
                    </Button>
                    <Button
                      htmlType="button"
                      shape="round"
                      onClick={this.onReset}
                      style={{
                        color: "#dc3545",
                        borderColor: "#dc3545",
                      }}
                    >
                      Reset
                    </Button>
                    <Upload {...props}>
                      <Button
                        shape="round"
                        icon={<UploadOutlined style={{ color: "#17a2b8" }} />}
                        style={{
                          color: "#17a2b8",
                          borderColor: "#17a2b8",
                        }}
                      >
                        Upload Menu
                      </Button>
                    </Upload>
                  </Space>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Col>
        <Col sm={4} md={16} lg={16} style={{ padding: 15 }}>
          <div
            className="card-shadow"
            style={{
              backgroundColor: "#242224",
              padding: 15,
              borderRadius: 6,
              boxShadow: 10,
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button
                  type="dashed"
                  shape="round"
                  size="small"
                  onClick={this.handleEditStock}
                  disabled={!hasSelected}
                >
                  Edit
                </Button>
                <Popconfirm
                  placement="topRight"
                  title="Are You Sure?"
                  onConfirm={this.handleDeleteStock}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="dashed"
                    shape="round"
                    size="small"
                    disabled={!hasSelected}
                    danger
                  >
                    Delete
                  </Button>
                </Popconfirm>
                <Button
                  type="dashed"
                  shape="round"
                  size="small"
                  onClick={this.handleClearSelection}
                  disabled={!hasSelected}
                >
                  Clear
                </Button>
                <Tag
                  visible={hasSelected}
                  style={{
                    borderStyle: "dashed",
                    color: "#d0d0d0",
                    backgroundColor: "#242224",
                  }}
                >
                  #{selectedRowKeys}
                </Tag>
              </Space>
              <div style={{ float: "right", color: "#fff" }}>
                <Space>
                  <Button
                    type="dashed"
                    shape="round"
                    size="small"
                    disabled={!filterTable}
                    onClick={this.handleReset}
                  >
                    Reset
                  </Button>
                  <Search
                    placeholder="Search Store"
                    allowClear
                    enterButton
                    size="small"
                    onSearch={this.handleStoreSearch}
                    style={{
                      color: "#d0d0d0",
                      borderColor: "#64395e",
                      fontSize: 10,
                    }}
                  />
                  <div style={{ textAlign: "center" }}>
                    <CSVLink
                      style={{ color: "#d0d0d0" }}
                      filename={"mg-menu-all.csv"}
                      className="csv-download-btn"
                      data={this.state.products}
                    >
                      Download
                    </CSVLink>
                  </div>
                </Space>
              </div>
            </div>
            <div>
              <Table
                size="small"
                rowSelection={{ type: "radio", ...rowSelection }}
                columns={columns}
                dataSource={filterTable == null ? store : filterTable}
                rowKey="id"
                pagination={{ pageSize: 20 }}
                scroll={{ y: 520 }}
                style={{ backgroundColor: "#242224" }}
              />
            </div>
          </div>
        </Col>
      </Row>
    );
  }
}

export default withRouter(ProductStore);
