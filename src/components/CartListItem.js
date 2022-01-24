import React from 'react';
import PropTypes from 'prop-types';

import {List, Button, ButtonGroup, Spin} from 'antd';
import { PlusOutlined, MinusOutlined, DeleteOutlined } from '@ant-design/icons';

export default class CartListItem extends React.Component {
    static propTypes = {
        changeQty: PropTypes.func.isRequired,
        item: PropTypes.object.isRequired
    }

    render(){
        const item = this.props.item;
        return(
            <div className="demo-infinite-container">
                <List
                    dataSource={this.state.data}
                        renderItem={item1 => (
                        <List.Item key={item.id}>
                            <List.Item.Meta
                            title={<a href="https://ant.design">{item.name.last}</a>}
                            description={item.email}
                            />
                            <div>
                                <ButtonGroup>
                                    <Button onClick={this.addQty}>
                                        <PlusOutlined />
                                    </Button>
                                    <Button onClick={this.removeQty}>
                                        <MinusOutlined />
                                    </Button>
                                    <Button danager onClick={this.handleDeleteItem}>
                                        <DeleteOutlined />
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </List.Item>
                        )}
                    >
                        {this.state.loading && this.state.hasMore && (
                        <div className="demo-loading-container">
                            <Spin />
                        </div>
                        )}
                </List>
            </div>
        );
    }
}