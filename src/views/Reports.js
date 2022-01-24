import React from "react";
import { withRouter } from "react-router-dom";
import Moment from "moment";

import { fetchData } from "../helpers/fetch-common.js";
import { ORDERS_ENDPOINT, ORDER_REPORT_ENDPOINT } from "../helpers/endpoints";
import axios from "axios";

import { CSVLink } from "react-csv";

import Chart from "../components/Charts/PieChart";
import BarChartReport from "../components/Charts/BarChart.js";
import ChartLine from "../components/Charts/LineChart.js";
import AreaChartReport from "../components/Charts/AreaChart.js";
import ReportTotalData from "../components/ReportTotalData";
import {
  Dropdown,
  Menu,
  Radio,
  Row,
  Col,
  Space,
  Button,
  Table,
  Input,
  Card,
  Divider,
  Progress,
} from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const { Search } = Input;
class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      date_start: new Date(),
      date_end: new Date(),
      reports: {
        total: 0,
        count: 0,
        avg: 0,
      },
      doneLoading: false,
      filterOrders: null,
      order_id: "",
      activeIndex: 0,
    };
  }

  getAllOrders() {
    const thisComp = this;
    fetchData(ORDERS_ENDPOINT, thisComp, "orders", true);
  }
  async getReports(endpoint) {
    const thisComp = this;
    axios
      .get(endpoint)
      .then((reps) => {
        return reps.data;
      })
      .then((responseData) => {
        const reports = {
          total: responseData.total,
          count: responseData.count,
          avg: responseData.avg,
        };
        thisComp.setState({
          reports: reports,
        });
      });
  }

  handleClearFilters = () => {
    this.componentDidMount();
  };

  handleSelectedCategories = (selectedCategories) => {
    if (selectedCategories) {
      const endpoint = ORDERS_ENDPOINT;
      this.getOrders(endpoint);
    }
  };
  getOrderReportTotal(orders) {
    return orders.reduce(
      (total, order) => total + parseInt(order.tag_value, 10),
      0
    );
  }
  getReportData(orders) {
    const reports = {
      total: parseInt(this.getOrderReportTotal(orders, 10)),
      count: orders.length,
      avg: (this.getOrderReportTotal(orders) / orders.length).toFixed(2),
    };
    this.setState({
      reports: reports,
    });
  }
  updateOrderReport(format) {
    let report_order = this.state.orders;
    report_order = report_order.filter(
      (order) =>
        Moment(order.tag_timestamp).format(format) === Moment().format(format)
    );

    return report_order;
  }
  handleSearch = (value) => {
    const { orders } = this.state;
    const filterOrders = orders.filter((item) =>
      Object.keys(item).some((k) =>
        String(item[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    this.setState({ filterOrders });
  };
  handleReset = () => {
    this.setState({
      filterOrders: null,
    });
  };
  handleOnChange = (e) => {
    const value = e.target.value;
    switch (value) {
      case "day":
        const daily_orders = this.updateOrderReport("YYYY-MM-DD");
        this.setState({ filterOrders: daily_orders });
        this.getReportData(daily_orders);
        break;
      case "week":
        const weekly_orders = this.updateOrderReport("GGGG-[W]WW");
        this.setState({ filterOrders: weekly_orders });
        this.getReportData(weekly_orders);
        break;
      case "month":
        const monthly_orders = this.updateOrderReport("YYYY-MM");
        this.setState({ filterOrders: monthly_orders });
        this.getReportData(monthly_orders);
        break;
      default:
        this.setState({ filterOrders: null });
        this.getReportData(this.state.orders);
        break;
    }
  };
  handlePrint = (id) => {
    const items = this.state.orders.filter((item) => item.id == id);
    this.setState({
      order_id: items[0].id,
    });
    console.log(items[0].id);
  };
  handleDownloadClick = (e) => {
    console.log("Download", e);
  };
  handleMenuClick = (e) => {
    console.log("Drop down", e.key);
  };

  componentDidMount() {
    this.getAllOrders();
    this.getReports(ORDER_REPORT_ENDPOINT);
  }

  render() {
    const { orders, filterOrders } = this.state;
    const daily_orders = this.updateOrderReport("YYYY-MM-DD");
    const weekly_orders = this.updateOrderReport("GGGG-[W]WW");
    const monthly_orders = this.updateOrderReport("YYYY-MM");
    const yearly_orders = this.updateOrderReport("YYYY");

    console.log(this.state.reports);
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1" icon={<DownloadOutlined />}>
          <CSVLink data={daily_orders}> Daily </CSVLink>
        </Menu.Item>
        <Menu.Item key="2" icon={<DownloadOutlined />}>
          <CSVLink data={weekly_orders}> Weekly </CSVLink>
        </Menu.Item>
        <Menu.Item key="3" icon={<DownloadOutlined />}>
          <CSVLink data={monthly_orders}> Monthly </CSVLink>
        </Menu.Item>
        <Menu.Item key="4" icon={<DownloadOutlined />}>
          <CSVLink data={yearly_orders}> Yearly </CSVLink>
        </Menu.Item>
        <Menu.Item key="5" icon={<DownloadOutlined />}>
          <CSVLink data={orders}> All </CSVLink>
        </Menu.Item>
      </Menu>
    );
    const columns = [
      {
        title: "Order No",
        dataIndex: "id",
        key: "id",
        width: "80px",
      },
      {
        title: "Date",
        dataIndex: "tag_timestamp",
        key: "tag_timestamp",
        width: "180px",
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
      },
      {
        title: "Value",
        dataIndex: "get_total_cost",
        key: "get_total_cost",
      },
      {
        title: "Action",
        key: "action",
        render: (text, record, index) => (
          <>
            <Button
              type="primary"
              size="small"
              onClick={(e) => {
                this.handlePrint(record.id);
              }}
            >
              Print
            </Button>
          </>
        ),
      },
    ];
    return (
      <Row>
        <Col sm={4} md={12} lg={12} style={{ padding: 15, paddingRight: 0 }}>
          <Row gutter={[12, 12]} style={{ marginBottom: 10 }}>
            <Col span={8}>
              <Card
                title="Products"
                size="small"
                className="card-shadow"
                bordered={false}
                style={{
                  textAlign: "center",
                  borderRadius: 6,
                }}
              >
                <ChartLine />
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title="Category"
                size="small"
                className="card-shadow"
                bordered={false}
                style={{
                  textAlign: "center",
                  borderRadius: 6,
                }}
              >
                <ChartLine />
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title="App"
                size="small"
                className="card-shadow"
                bordered={false}
                style={{
                  textAlign: "center",
                  borderRadius: 6,
                }}
              >
                <ChartLine />
              </Card>
            </Col>
          </Row>
          <Row gutter={[12, 12]} style={{ marginBottom: 10 }}>
            <Col span={12}>
              <Card
                size="small"
                className="card-shadow"
                bordered={false}
                style={{
                  textAlign: "center",
                  borderRadius: 6,
                }}
              >
                <BarChartReport />
              </Card>
            </Col>
            <Col span={12}>
              <Card
                size="small"
                className="card-shadow"
                bordered={false}
                style={{
                  textAlign: "center",
                  borderRadius: 6,
                }}
              >
                <AreaChartReport />
              </Card>
            </Col>
          </Row>
          <Row gutter={[12, 12]} style={{ marginBottom: 10 }}>
            <Col span={18}>
              <Card
                className="card-shadow"
                bordered={false}
                style={{
                  textAlign: "center",
                  borderRadius: 6,
                }}
              >
                <Chart />
              </Card>
            </Col>
            <Col span={6}>
              <Card
                className="card-shadow"
                bordered={false}
                style={{
                  textAlign: "center",
                  borderRadius: 6,
                }}
              >
                <Divider>2021</Divider>
                <ReportTotalData reports={this.state.reports} />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col sm={4} md={12} lg={12} style={{ padding: 15 }}>
          <Row gutter={[12, 12]} style={{ marginBottom: 10 }}>
            <Col span={8}>
              <Card
                className="card-shadow"
                bordered={false}
                style={{
                  textAlign: "center",
                  backgroundColor: "#242224",
                  borderRadius: 6,
                }}
              >
                <Space>
                  <Progress
                    type="circle"
                    width={74}
                    strokeColor={{
                      "0%": "#9C3D54",
                      "100%": "#B2B1B9",
                    }}
                    percent={
                      this.state.filterOrders
                        ? this.state.filterOrders.length
                        : this.state.orders.length
                    }
                    format={(percent) => `${percent}`}
                  />
                  <span>Count</span>
                </Space>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                className="card-shadow"
                bordered={false}
                style={{
                  textAlign: "center",
                  backgroundColor: "#242224",
                  borderRadius: 6,
                }}
              >
                <Space>
                  <Progress
                    type="circle"
                    width={74}
                    strokeColor={{
                      "0%": "#9C3D54",
                      "100%": "#B2B1B9",
                    }}
                    percent={this.state.reports.total % 100}
                    format={(percent) =>
                      `${parseInt(this.state.reports.total, 10)}`
                    }
                  />
                  <br />
                  <span>
                    Sale &#8377;
                    {parseInt(this.state.reports.total, 10)}
                  </span>
                </Space>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                className="card-shadow"
                bordered={false}
                style={{
                  textAlign: "center",
                  backgroundColor: "#242224",
                  borderRadius: 6,
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <Space>
                    <Progress
                      type="circle"
                      width={74}
                      strokeColor={{
                        "0%": "#9C3D54",
                        "100%": "#B2B1B9",
                      }}
                      percent={this.state.reports.avg}
                      format={(percent) => `${this.state.reports.avg}`}
                    />
                    <span>Average &#8377;{this.state.reports.avg}</span>
                  </Space>
                </div>
              </Card>
            </Col>
          </Row>
          <Row>
            <div
              className="card-shadow"
              style={{
                backgroundColor: "#242224",
                padding: 15,
                borderRadius: 6,
                boxShadow: 10,
              }}
            >
              <div style={{ marginBottom: 20 }}>
                <Space>
                  <Radio.Group
                    defaultValue="all"
                    size="small"
                    onChange={this.handleOnChange}
                  >
                    <Radio.Button value="all">All</Radio.Button>
                    <Radio.Button value="day">Today</Radio.Button>
                    <Radio.Button value="week">Week</Radio.Button>
                    <Radio.Button value="month">Month</Radio.Button>
                  </Radio.Group>
                </Space>
                <div
                  style={{ float: "right", color: "#fff", marginBottom: 10 }}
                >
                  <Space>
                    <Button
                      type="dashed"
                      shape="round"
                      size="small"
                      onClick={this.handleReset}
                    >
                      Reset
                    </Button>
                    <Search
                      placeholder="Search Orders"
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
                      <Dropdown.Button
                        type="primary"
                        size="small"
                        key="66"
                        overlay={menu}
                        icon={<DownloadOutlined />}
                        onClick={this.handleDownloadClick}
                      >
                        Download
                      </Dropdown.Button>
                    </div>
                  </Space>
                </div>
              </div>
              <div>
                <Table
                  size="small"
                  columns={columns}
                  dataSource={filterOrders == null ? orders : filterOrders}
                  rowKey="id"
                  pagination={{ position: ["bottomCenter"] }}
                  scroll={{ y: 540 }}
                  style={{ backgroundColor: "#242224" }}
                />
              </div>
            </div>
          </Row>
        </Col>
      </Row>
    );
  }
}
export default withRouter(Report);
