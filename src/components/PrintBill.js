import React from "react";

export default class PrintBill extends React.PureComponent {
  
  render() {
    const { order_items } = this.props;
    const { order_data } = this.props;
    const { kot_counter } = this.props;
    return (
      <div className="print-kot-bill">
        <div className="print-header">
          <h3 className="print-h" style={{ marginBottom: 0 }}>
            Mangala's Kitchen
          </h3>
          <h4 className="print-h" style={{ marginBottom: 0 }}>
            A Taste of Home
          </h4>
          <h4 className="print-h"> Ahemdabad In</h4>
        </div>
        <div className="print-order">
          <h4 className="print-o">Bill Number: {order_data.id} </h4>
          <h4 className="print-o">Order Number: {order_data.id} </h4>
          <h4 className="print-o">Date: {order_data.tag_timestamp} </h4>
          <h4 className="print-o">Kot Number: {kot_counter}</h4>
        </div>
        <div className="span-header">
          <span className="print-i-title">Items</span>
          <span style={{ marginRight: 20 }}> Qty</span> <span>Amt</span>
        </div>
        <div>
          <table>
            <tbody>
              {order_items.map((item, index) => (
                <tr key={index} className="print-item">
                  <td>{item.tag_menu_related}</td>
                  <td>{item.qty}</td>
                  <td>{item.tag_total_value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <hr />
        <ul className="total-ul">
          <li>Total Amount: </li>
          <li className="total-li">
            {order_data.tag_value}
            <span>INR</span>
          </li>
        </ul>
      </div>
    );
  }
}
