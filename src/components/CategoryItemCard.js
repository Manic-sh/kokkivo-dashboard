import React from "react";
import PropTypes from "prop-types";
import { Card, Avatar, Space, List } from "antd";
import { QrcodeOutlined } from "@ant-design/icons";

export default class CategoryCard extends React.Component {
  static propTypes = {
    handleFilterProduct: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
  };

  handleFilterCategoryProduct = (id) => {
    this.props.handleFilterProduct(id);
  };

  render() {
    const { categories } = this.props;
    return (
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 6,
          xxl: 3,
        }}
        dataSource={categories}
        renderItem={(item) => (
          <List.Item>
            <CategoryItemCard
              category={item}
              handleFilterCategoryProduct={this.handleFilterCategoryProduct}
            />
          </List.Item>
        )}
      />
    );
  }
}

class CategoryItemCard extends React.Component {
  static propTypes = {
    handleFilterCategoryProduct: PropTypes.func.isRequired,
    category: PropTypes.object.isRequired,
  };

  handleFilterCategoryProduct = () => {
    this.props.handleFilterCategoryProduct(this.props.category.id);
  };

  render() {
    const { category } = this.props;
    return (
      <Card
        hoverable
        className="category-card"
        onClick={this.handleFilterCategoryProduct}
      >
        <Space direction="vertical">
          <Avatar
            style={{ backgroundColor: "#64395e" }}
            icon={<QrcodeOutlined />}
          />
          {category.category}
        </Space>
      </Card>
    );
  }
}
