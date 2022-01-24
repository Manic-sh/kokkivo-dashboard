import React from "react";
import PropTypes from "prop-types";
import { Table, Input, Button, Space, message } from "antd";

class ReportGrid extends React.Component {
  PropTypes = {
    orders: PropTypes.array,
  };

  handlePrint = (id) => {
    const items = this.state.order_data.filter((item) => item.id == id);
    this.setState({
      order_id: items[0].id,
    });
    return Promise.resolve();
  };

  render() {
    const columns = [
      {
        title: "Order No",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Date",
        dataIndex: "tag_timestamp",
        key: "tag_timestamp",
      },
      {
        title: "Kot No",
        dataIndex: "tag_kot",
        key: "kot_tag",
      },
      {
        title: "Status",
        dataIndex: "tag_active",
        key: "tag_active",
      },
      {
        title: "Value",
        dataIndex: "tag_value",
        key: "tag_value",
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

    const orders = this.props.orders;
    return (
      <>
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 40 }}
          scroll={{ y: 440 }}
        />
      </>
    );
  }
}

export default ReportGrid;

/*            <div style={{ overflow: "hidden", height: 0 }}>
              <PrintBill
                order_id={this.state.order_id}
                order_data={this.state.order_data}
                order_items={this.state.order_items}
                kot_counter={this.state.kot_counter}
                ref={(el) => (this.componentRef = el)}
              />
            </div>
            */
