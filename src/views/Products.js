import React from "react";
import { withRouter } from "react-router-dom";
import { TweenOneGroup } from "rc-tween-one";

import {
  Typography,
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
  Drawer,
} from "antd";
import {
  PRODUCT_ENDPOINT,
  PRODUCT_DETAIL_ENDPOINT,
  CATEGORYS_ENDPOINT,
  CATEGORY_DETAIL_ENDPOINT,
  SUBCATEGORY_ENDPOINT,
  SUBCATEGORY_DETAIL_ENDPOINT,
  SIZE_ENDPOINT,
  COLOR_ENDPOINT,
  STOCK_ENDPOINT,
} from "../helpers/endpoints.js";
import { fetchData } from "../helpers/fetch-common.js";

import {
  UploadOutlined,
  ShoppingOutlined,
  GroupOutlined,
  StockOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { CSVLink } from "react-csv";
import axios from "axios";

const { Option } = Select;
const { Search } = Input;

class Products extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.formCatRef = React.createRef();
    this.formSubCatRef = React.createRef();
    this.state = {
      products: [],
      categories: [],
      subcategories: [],
      sizes: [],
      colors: [],
      store: [],
      doneLoading: false,
      selectedRowKeys: undefined,
      drawerVisible: false,
      drawerSubVisible: false,
      editAction: false,
      filterTable: null,
      catEditId: null,
      btnText: "Add",
    };
  }

  getProducts(endpoint) {
    const thisComp = this;
    fetchData(endpoint, thisComp, "products", true);
  }
  getCategories() {
    const thisComp = this;
    fetchData(CATEGORYS_ENDPOINT, thisComp, "categories");
  }
  getSubCategories() {
    const thisComp = this;
    fetchData(SUBCATEGORY_ENDPOINT, thisComp, "subcategories");
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
      const endpoint = PRODUCT_DETAIL_ENDPOINT + `${id}/`;
      let data = [...this.state.products];
      let index = data.findIndex((eid) => eid.id == id);
      try {
        axios.put(endpoint, values).then((res) => {
          message.success("Product Edited Successfully");
          this.formRef.current.resetFields();
          data[index] = res.data;
          if (this.state.filterTable) {
            this.setState({
              filterTable: data,
              editAction: false,
            });
          }
          this.setState({
            products: data,
            editAction: false,
          });
        });
      } catch (error) {
        console.log("Error ", error);
      }
    } else {
      try {
        console.log(values);
        axios.post(PRODUCT_ENDPOINT, values).then((res) => {
          message.success("Product Added Successfully");
          if (this.state.filterTable) {
            this.setState((state) => ({
              filterTable: [...state.filterTable, res.data],
            }));
          } else {
            this.setState((state) => ({
              products: [...state.products, res.data],
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
  handleEditProduct = () => {
    const id = this.state.selectedRowKeys[0];
    const endpoint = PRODUCT_DETAIL_ENDPOINT + `${id}/`;
    try {
      axios.get(endpoint).then((res) => {
        this.formRef.current.setFieldsValue({
          subcategory: res.data.subcategory,
          category: res.data.category,
          name: res.data.name,
          description: res.data.description,
          price: res.data.price,
          size: res.data.size,
          color: res.data.color,
        });
        this.setState({ editAction: true });
      });
    } catch (error) {
      console.log(error);
    }
  };
  handleDeleteProduct = () => {
    const id = this.state.selectedRowKeys[0];
    const endpoint = PRODUCT_DETAIL_ENDPOINT + `${id}/`;
    try {
      axios.delete(endpoint).then((res) => {
        this.setState({ selectedRowKeys: undefined, editAction: false });
        message.success("Product Removed Successfully");
        if (this.state.filterTable) {
          const fitem = this.state.filterTable.filter((item) => item.id !== id);
          this.setState({
            filterTable: fitem,
            selectedRowKeys: undefined,
            editAction: false,
          });
        }
        const items = this.state.products.filter((item) => item.id !== id);
        this.setState({
          products: items,
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

  handleSearch = (value) => {
    const { products } = this.state;
    const filterTable = products.filter((item) =>
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

  handleResetSubcategory = () => {
    this.formSubCatRef.current.resetFields();
    this.setState({ btnText: "Add" });
    this.getSubCategories();
  };

  handleResetCategory = () => {
    this.formCatRef.current.resetFields();
    this.setState({ btnText: "Add" });
    this.getCategories();
  };

  handleAddEditSubcategory = (values) => {
    if (this.state.catEditId) {
      const id = this.state.catEditId;
      const endpoint = SUBCATEGORY_DETAIL_ENDPOINT + `${id}/`;
      console.log(endpoint);
      try {
        axios.put(endpoint, values).then((res) => {
          message.success("Category Edited Successfully");
          const subcategories = this.state.subcategories.filter(
            (sub) => sub.id !== id
          );
          this.setState((state) => ({
            subcategories: [...subcategories, res.data],
            btnText: "Add",
          }));
          this.formSubCatRef.current.resetFields();
        });
      } catch (error) {
        console.log("Error ", error);
      }
    } else {
      try {
        axios.post(SUBCATEGORY_ENDPOINT, values).then((res) => {
          message.success("Category Added Successfully");
          this.setState((state) => ({
            subcategories: [...state.subcategories, res.data],
          }));
          this.formSubCatRef.current.resetFields();
        });
      } catch (error) {
        console.log("Error ", error);
      }
    }
  };

  handleDeleteSubCategory = (removedTag) => {
    const tag = this.state.subcategories.find(
      (item) => item.category == removedTag
    );
    const endpoint = SUBCATEGORY_DETAIL_ENDPOINT + `${tag.id}/`;
    try {
      axios.delete(endpoint).then((res) => {
        const subcategories = this.state.subcategories.filter(
          (sub) => sub.category !== removedTag
        );
        this.setState({ subcategories, btnText: "Add", catEditId: "" });
        this.formSubCatRef.current.resetFields();
        message.success("Category Removed Successfully");
      });
    } catch (error) {
      console.log(error);
    }
  };

  handleSearchSubCategory = (value) => {
    const subcategories = this.state.subcategories.filter((item) =>
      Object.keys(item).some((k) =>
        String(item[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    this.setState({ subcategories });
  };

  handleTagClicked = (e) => {
    const dataValue = e.target.textContent;
    const tagEdit = this.state.subcategories.find(
      (item) => item.category == dataValue
    );
    this.formSubCatRef.current.setFieldsValue({
      category: tagEdit.category,
      description: tagEdit.description,
    });
    this.setState({ catEditId: tagEdit.id, btnText: "Update" });
  };

  forSubCatMap = (tag) => {
    const tagElem = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          this.handleDeleteSubCategory(tag);
        }}
        onClick={this.handleTagClicked}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: "inline-block" }}>
        {tagElem}
      </span>
    );
  };

  handleAddEditCategory = (values) => {
    if (this.state.catEditId) {
      const id = this.state.catEditId;
      const endpoint = CATEGORY_DETAIL_ENDPOINT + `${id}/`;
      console.log(endpoint);
      try {
        axios.put(endpoint, values).then((res) => {
          message.success("Category Edited Successfully");
          const categories = this.state.categories.filter(
            (sub) => sub.id !== id
          );
          this.setState((state) => ({
            categories: [...categories, res.data],
            btnText: "Add",
          }));
          this.formCatRef.current.resetFields();
        });
      } catch (error) {
        console.log("Error ", error);
      }
    } else {
      try {
        axios.post(CATEGORYS_ENDPOINT, values).then((res) => {
          message.success("Category Added Successfully");
          this.setState((state) => ({
            categories: [...state.categories, res.data],
          }));
          this.formCatRef.current.resetFields();
        });
      } catch (error) {
        console.log("Error ", error);
      }
    }
  };

  handleDeleteCategory = (removedTag) => {
    const tag = this.state.categories.find(
      (item) => item.category == removedTag
    );
    const endpoint = CATEGORY_DETAIL_ENDPOINT + `${tag.id}/`;
    try {
      axios.delete(endpoint).then((res) => {
        const categories = this.state.categories.filter(
          (sub) => sub.category !== removedTag
        );
        this.setState({ categories, btnText: "Add", catEditId: "" });
        this.formCatRef.current.resetFields();
        message.success("Category Removed Successfully");
      });
    } catch (error) {
      console.log(error);
    }
  };

  handleSearchCategory = (value) => {
    const categories = this.state.categories.filter((item) =>
      Object.keys(item).some((k) =>
        String(item[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    this.setState({ categories });
  };

  handleCatTagClicked = (e) => {
    const dataValue = e.target.textContent;
    const tagEdit = this.state.categories.find(
      (item) => item.category == dataValue
    );
    this.formCatRef.current.setFieldsValue({
      category: tagEdit.category,
      description: tagEdit.description,
    });
    this.setState({ catEditId: tagEdit.id, btnText: "Update" });
  };

  forCatMap = (tag) => {
    const tagElem = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          this.handleDeleteCategory(tag);
        }}
        onClick={this.handleCatTagClicked}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: "inline-block" }}>
        {tagElem}
      </span>
    );
  };

  showDrawer = () => {
    this.setState({
      drawerVisible: true,
    });
  };
  showSubDrawer = () => {
    this.setState({
      drawerSubVisible: true,
    });
  };
  onCloseDrawer = () => {
    this.setState({
      drawerVisible: false,
    });
  };
  onCloseSubDrawer = () => {
    this.setState({
      drawerSubVisible: false,
    });
  };
  componentDidMount() {
    this.getProducts(PRODUCT_ENDPOINT);
    this.getCategories();
    this.getSubCategories();
    this.getSizes();
    this.getColors();
    this.getStock();
  }

  render() {
    const { selectedRowKeys } = this.state;
    const { products, filterTable, subcategories, categories } = this.state;
    const subcategory = subcategories
      .map((subcat) => subcat.category)
      .map(this.forSubCatMap);

    const category = categories.map((cat) => cat.category).map(this.forCatMap);

    const options = this.state.categories.map((d) => (
      <Option key={d.id} value={d.id}>
        <span>{d.category}</span>
      </Option>
    ));

    const subOptions = this.state.subcategories.map((item) => (
      <Option key={item.id} value={item.id}>
        <span>{item.category}</span>
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
        dataIndex: "name",
        width: 200,
      },
      {
        title: "Category",
        dataIndex: "tag_category",
      },
      {
        title: "Sub Category",
        dataIndex: "tag_subcategory",
      },
      {
        title: "Price",
        dataIndex: "price",
        width: 100,
      },
    ];
    const hasSelected = selectedRowKeys;
    return (
      <Row style={{ backgroundColor: "#1d1a1d" }}>
        <Col sm={4} md={12} lg={12} style={{ padding: 15 }}>
          <Row gutter={[24, 24]}>
            <Col span={6}>
              <Card
                className="card-shadow"
                size="small"
                bordered={false}
                hoverable={true}
                style={{
                  textAlign: "center",
                  backgroundColor: "#242224",
                  borderRadius: 6,
                }}
              >
                <ShoppingOutlined style={{ fontSize: 32, color: "#64395e" }} />
                <br />
                Products
                <Divider>{this.state.products.length}</Divider>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                className="card-shadow"
                size="small"
                bordered={false}
                hoverable={true}
                onClick={this.showDrawer}
                style={{
                  textAlign: "center",
                  backgroundColor: "#242224",
                  borderRadius: 6,
                }}
              >
                <GroupOutlined style={{ fontSize: 32, color: "#64395e" }} />{" "}
                <br />
                Category
                <Divider>{this.state.subcategories.length}</Divider>
              </Card>
              <Drawer
                title="Category"
                width={450}
                onClose={this.onCloseDrawer}
                visible={this.state.drawerVisible}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                  <Space>
                    <Button onClick={this.onCloseDrawer}>Cancel</Button>
                    <Button onClick={this.onCloseDrawer} type="primary">
                      Submit
                    </Button>
                  </Space>
                }
              >
                <Form
                  layout="vertical"
                  size="small"
                  onFinish={this.handleAddEditSubcategory}
                  ref={this.formSubCatRef}
                  hideRequiredMark
                >
                  <Row gutter={8}>
                    <Col span={24}>
                      <Form.Item
                        name="category"
                        label="Name"
                        rules={[
                          {
                            required: true,
                            message: "Please enter Category Title",
                          },
                        ]}
                      >
                        <Input placeholder="Enter Category Title" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                          {
                            required: true,
                            message: "please enter description",
                          },
                        ]}
                      >
                        <Input.TextArea
                          rows={3}
                          placeholder="Enter Description"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Space>
                        <Button
                          type="primary"
                          shape="round"
                          htmlType="submit"
                          size="small"
                          //disabled={!hasSelected}
                        >
                          {this.state.btnText}
                        </Button>
                        <Button
                          type="dashed"
                          shape="round"
                          size="small"
                          onClick={this.handleResetSubcategory}
                          style={{
                            color: "#dc3545",
                            borderColor: "#dc3545",
                          }}
                          //disabled={!hasSelected}
                        >
                          Reset
                        </Button>
                      </Space>
                      <div style={{ float: "right", color: "#fff" }}>
                        <Space>
                          <Search
                            placeholder="Search Category"
                            allowClear
                            enterButton
                            size="small"
                            onSearch={this.handleSearchSubCategory}
                            style={{
                              color: "#d0d0d0",
                              borderColor: "#64395e",
                              fontSize: 10,
                            }}
                          />
                        </Space>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={8}>
                    <Col span={24}>
                      <div style={{ marginTop: 24 }}>
                        <TweenOneGroup
                          enter={{
                            scale: 0.8,
                            opacity: 0,
                            type: "from",
                            duration: 100,
                          }}
                          onEnd={(e) => {
                            if (e.type === "appear" || e.type === "enter") {
                              e.target.style = "display: inline-block";
                            }
                          }}
                          leave={{
                            opacity: 0,
                            width: 0,
                            scale: 0,
                            duration: 200,
                          }}
                          appear={false}
                        >
                          {subcategory}
                        </TweenOneGroup>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Drawer>
            </Col>
            <Col span={6}>
              <Card
                className="card-shadow"
                size="small"
                onClick={this.showSubDrawer}
                bordered={false}
                hoverable={true}
                style={{
                  textAlign: "center",
                  backgroundColor: "#242224",
                  borderRadius: 6,
                }}
              >
                <UnorderedListOutlined
                  style={{ fontSize: 32, color: "#64395e" }}
                />
                <br />
                Sub Category
                <Divider>{this.state.categories.length}</Divider>
              </Card>
              <Drawer
                title="SubCategory"
                width={450}
                onClose={this.onCloseSubDrawer}
                visible={this.state.drawerSubVisible}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                  <Space>
                    <Button onClick={this.onCloseSubDrawer}>Cancel</Button>
                    <Button onClick={this.onCloseSubDrawer} type="primary">
                      Submit
                    </Button>
                  </Space>
                }
              >
                <Form
                  layout="vertical"
                  size="small"
                  onFinish={this.handleAddEditCategory}
                  ref={this.formCatRef}
                  hideRequiredMark
                >
                  <Row gutter={8}>
                    <Col span={24}>
                      <Form.Item
                        name="category"
                        label="Name"
                        rules={[
                          {
                            required: true,
                            message: "Please enter Sub Category Title",
                          },
                        ]}
                      >
                        <Input placeholder="Enter Sub Category Title" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                          {
                            required: true,
                            message: "please enter description",
                          },
                        ]}
                      >
                        <Input.TextArea
                          rows={3}
                          placeholder="Enter Description"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Space>
                        <Button
                          type="primary"
                          shape="round"
                          htmlType="submit"
                          size="small"
                          //disabled={!hasSelected}
                        >
                          {this.state.btnText}
                        </Button>
                        <Button
                          type="dashed"
                          shape="round"
                          size="small"
                          onClick={this.handleResetCategory}
                          style={{
                            color: "#dc3545",
                            borderColor: "#dc3545",
                          }}
                          //disabled={!hasSelected}
                        >
                          Reset
                        </Button>
                      </Space>
                      <div style={{ float: "right", color: "#fff" }}>
                        <Space>
                          <Search
                            placeholder="Search Category"
                            allowClear
                            enterButton
                            size="small"
                            onSearch={this.handleSearchCategory}
                            style={{
                              color: "#d0d0d0",
                              borderColor: "#64395e",
                              fontSize: 10,
                            }}
                          />
                        </Space>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={8}>
                    <Col span={24}>
                      <div style={{ marginTop: 24 }}>
                        <TweenOneGroup
                          enter={{
                            scale: 0.8,
                            opacity: 0,
                            type: "from",
                            duration: 100,
                          }}
                          onEnd={(e) => {
                            if (e.type === "appear" || e.type === "enter") {
                              e.target.style = "display: inline-block";
                            }
                          }}
                          leave={{
                            opacity: 0,
                            width: 0,
                            scale: 0,
                            duration: 200,
                          }}
                          appear={false}
                        >
                          {category}
                        </TweenOneGroup>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Drawer>
            </Col>
            <Col span={6}>
              <Card
                className="card-shadow"
                size="small"
                bordered={false}
                hoverable={true}
                style={{
                  textAlign: "center",
                  backgroundColor: "#242224",
                  borderRadius: 6,
                }}
              >
                <StockOutlined style={{ fontSize: 32, color: "#64395e" }} />{" "}
                <br />
                Stock
                <Divider>{this.state.store.length}</Divider>
              </Card>
            </Col>
          </Row>
          <Row style={{ marginTop: 15 }}>
            <Col
              className="card-shadow"
              span={24}
              style={{ backgroundColor: "#242224", borderRadius: 6 }}
            >
              <Form
                size="small"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                style={{ padding: 15, fontStyle: "#d0d0d0" }}
                ref={this.formRef}
                name="control-ref"
                onFinish={this.onFinish}
              >
                <Form.Item
                  name="category"
                  label="Category"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Select Category"
                    onChange={this.handleCategoryChange}
                    allowClear
                  >
                    {options}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="subcategory"
                  label="Sub Category"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Select Sub Category"
                    onChange={this.handleSubCategoryChange}
                    allowClear
                  >
                    {subOptions}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="name"
                  label="Product Name"
                  rules={[{ required: true }]}
                >
                  <Input onChange={this.handleChangeName} />
                </Form.Item>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true }]}
                >
                  <Input.TextArea />
                </Form.Item>
                <Form.Item label="Sizes" name="size">
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Select Multiple Size"
                    onChange={this.handleSizeChange}
                  >
                    {sizeOptions}
                  </Select>
                </Form.Item>
                <Form.Item label="Colors" name="color">
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Select Multiple Color"
                    onChange={this.handleColorChange}
                  >
                    {colorOptions}
                  </Select>
                </Form.Item>
                <Form.Item label="Price">
                  <Row gutter={8}>
                    <Col>
                      <Form.Item name="price" rules={[{ required: true }]}>
                        <InputNumber min={1} />
                      </Form.Item>
                    </Col>
                  </Row>
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
                      Add Product
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
        <Col sm={4} md={12} lg={12} style={{ padding: 15 }}>
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
                  onClick={this.handleEditProduct}
                  disabled={!hasSelected}
                >
                  Edit
                </Button>
                <Popconfirm
                  placement="topRight"
                  title="Are You Sure?"
                  onConfirm={this.handleDeleteProduct}
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
                    placeholder="Search Product"
                    allowClear
                    enterButton
                    size="small"
                    onSearch={this.handleSearch}
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
                dataSource={filterTable == null ? products : filterTable}
                rowKey="id"
                pagination={{ pageSize: 50 }}
                scroll={{ y: 533 }}
                style={{ backgroundColor: "#242224" }}
              />
            </div>
          </div>
        </Col>
      </Row>
    );
  }
}

export default withRouter(Products);
