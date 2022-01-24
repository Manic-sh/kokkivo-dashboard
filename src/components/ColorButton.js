import React from "react";
import PropTypes from "prop-types";
import { Radio } from "antd";

import { COLOR_ENDPOINT } from "../helpers/endpoints";
import { fetchData } from "../helpers/fetch-common";

export default class ColorButton extends React.Component {
  state = { bgcolor: [], selected_color: "red" };

  static propTypes = {
    colors: PropTypes.array.isRequired,
    handleSelectedColor: PropTypes.func.isRequired,
  };

  onChange = (e) => {
    this.setState({
      selected_color: e.target.value,
    });
    this.props.handleSelectedColor(e.target.value);
  };

  getAllColors(endpoint) {
    const thisComp = this;
    fetchData(endpoint, thisComp, "bgcolor");
  }

  setRadioBackground(colors) {
    const allcolors = this.state.bgcolor;
  }

  componentDidMount() {
    this.getAllColors(COLOR_ENDPOINT);
    this.setRadioBackground(this.props.colors);
  }
  render() {
    const { colors } = this.props;

    return (
      <>
        <Radio.Group size="small" onChange={this.onChange} buttonStyle="solid">
          {colors.map((color, index) => (
            <Radio.Button value={color} key={index}>
              {color}
            </Radio.Button>
          ))}
        </Radio.Group>
      </>
    );
  }
}
