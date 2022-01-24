import React from "react";
import PropTypes from "prop-types";

import { List } from "antd";

export default class PrintKOT extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
  };
  render() {
    const item = this.props.item;
    return (
      <List.Item key={item.id} >
        <List.Item.Meta title={item.tag_menu_related} />
        <div>
          {item.qty}
          {item.tag_total_value}
        </div>
      </List.Item>
    );
  }
}
