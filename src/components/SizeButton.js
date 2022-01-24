import React from "react";
import PropTypes from "prop-types";
import { Radio } from "antd";

export default class SizeButton extends React.Component {
  state = {
    inStock: true,
  };

  static propTypes = {
    sizes: PropTypes.array.isRequired,
    handleSelectedSize: PropTypes.func.isRequired,
  };

  onChange = (e) => {
    this.props.handleSelectedSize(e.target.value);
  };

  render() {
    const { sizes } = this.props;
    console.log(sizes);

    return (
      <>
        <Radio.Group size="small" onChange={this.onChange} buttonStyle="solid">
          {sizes.map((size, index) => (
            <Radio.Button value={size} key={index}>
              {size}
            </Radio.Button>
          ))}
        </Radio.Group>
      </>
    );
  }
}
