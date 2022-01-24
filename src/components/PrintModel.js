import React from 'react';
import ReactToPrint from 'react-to-print';
import { List, Button, Modal } from 'antd';

import PrintKOT from './PrintKot.js';

/*
    setmodalPrintKot(modalPrintKot) {
        this.setState({ modalPrintKot });
    }

    showModal = (show, action) => {
        this.setState({ show: show, action: action }); 
    }
                            <PrintModel
                                show={this.state.show}
                                action={this.state.action}
                                showModal={this.showModal}
                                order_data={this.props.order_data}
                                order_items={this.props.order_items}
                                handleCloseKOT={this.handleCloseKOT}
                            />
                            */

export default class PrintModel extends React.Component {
    handleClose = (action) => {
        this.props.handleCloseKOT(action);
    }
    handleCloseModal = () => {
        this.props.showModal(false, "");
    }
    render() {
        const { order_items } = this.props;
        const { order_data } = this.props;
        const { action } = this.props;
        if (!this.props.show) {
            return null;
        } else {
            return (
                <Modal
                    title="Order Details"
                    centered
                    visible={this.props.show}
                    onOk={() => this.handleClose(action)}
                    onCancel={this.handleCloseModal}
                    footer={[
                        <Button key="back" onClick={this.handleCloseModal}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" onClick={() => this.handleClose(action)}>
                            Ok
                      </Button>,
                        <ReactToPrint
                            trigger={() => (
                                <a className="ant-btn ant-btn-primary" href="#print-kot-bill">
                                    Print
                                </a>
                            )}
                            content={() => this.componentRef}
                        />,
                    ]}
                >
                    <div ref={el => (this.componentRef = el)} >
                        <div className="print-kot-bill">
                            <h3>BreakTime IN</h3>
                            <h5 style={{textAlign:'center', marginTop: -20}}>CIMS Hospital - Ahemdabad</h5>
                            <h4>Bill Number: {order_data.id} </h4>
                            <h4>Order Number: {order_data.title} </h4>
                            <h4>Date: {order_data.tag_timestamp} </h4>
                            <h4>Kot Number: {order_data.tag_kot}</h4>
                            <hr />
                            <span className="title-span">Items</span> <span className="title-span"> Qty</span> <span>Amt</span>
                            <hr />
                            <List
                                className="print-list"
                                dataSource={order_items}
                                renderItem={item => (
                                    <PrintKOT
                                        item={item}
                                    />
                                )}
                            />
                            <hr />
                            <ul className="total-ul">
                                <li>Total Amount: </li>
                                <li className="total-li">{order_data.tag_value}<span> INR</span></li>
                            </ul>
                        </div>
                    </div>

                </Modal>
            )
        }
    }
}