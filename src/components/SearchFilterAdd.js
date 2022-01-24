import React from "react";
import PropTypes from "prop-types";

import { Select, Space, AutoComplete } from "antd";

import { PRODUCT_ENDPOINT } from "../helpers/endpoints";
import { fetchData } from "../helpers/fetch-common.js";

const { Option } = Select;

export default class SearchFilterAdd extends React.Component {
  constructor(props) {
    super(props);
    this.autoRef = React.createRef();

    this.state = {
      products: [],
      value: undefined,
      menu_id: undefined,
      qty: undefined,
      doneLoading: false,
    };
  }

  static propTypes = {
    handleAddOrEditProduct: PropTypes.func,
    order_data: PropTypes.array,
  };

  getProducts() {
    const thisComp = this;
    fetchData(PRODUCT_ENDPOINT, thisComp, "products");
  }

  handleSearch = async (value, option) => {
    if (value) {
      fetch(value, (products) => this.setState({ products }));
    }
  };

  onSelect = (value, option) => {
    this.setState({
      menu_id: option.key,
    });
  };

  handleChange = (value) => {
    this.setState({ value });
    if (this.state.menu_id) {
      this.setState({ menu_id: "" });
    }
  };

  handleChangeQty = (qty) => {
    this.setState({ qty });
  };

  async addProduct() {
    if (this.state.menu_id) {
      if (this.state.qty) {
        this.props.handleAddOrEditProduct(this.state.menu_id, this.state.qty);
      } else {
        this.props.handleAddOrEditProduct(this.state.menu_id, 1);
      }
      this.setState({ value: "", menu_id: "" });
    }
  }
  onFinish = (values) => {
    this.addProduct();
    this.setState({ value: "", menu_id: "", qty: 1 });
    this.autoRef.current.focus();
  };
  handleEnterPress = (value) => {
    this.addProduct();
    this.setState({ value: "", menu_id: "", qty: 1 });
    this.autoRef.current.focus();
  };

  onKeyDown = (e) => {
    if (e.keyCode == 13) {
      this.addProduct();
    } else if (e.keyCode == 27) {
      this.setState({
        value: "",
        menu_id: "",
        qty: 1,
      });
    } else {
      return;
    }
  };
  componentDidMount() {
    this.getProducts();
  }
  render() {
    const options = this.state.products.map((d) => (
      <Option key={d.id} value={d.name}>
        <Space>
          <span>{d.name}</span>
          <span>{d.price}</span>
        </Space>
      </Option>
    ));
    return (
      <div onKeyDown={this.onKeyDown}>
        <AutoComplete
          placeholder="Search Products"
          allowClear={true}
          autoFocus={true}
          backfill={true}
          dropdownMatchSelectWidth={252}
          style={{
            width: 460,
            backgroundColor: "#141414",
            lineHeight: 40,
          }}
          onSelect={this.onSelect}
          onSearch={this.handleSearch}
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          onChange={this.handleChange}
          value={this.state.value}
          ref={this.autoRef}
        >
          {options}
        </AutoComplete>
      </div>
    );
  }
}
