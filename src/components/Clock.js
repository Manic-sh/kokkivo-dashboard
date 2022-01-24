import React from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: new Date().toLocaleString()
        };
    }
    componentDidMount() {
        this.intervalID = setInterval(
            () => this.tick(),
            1000
        );
    }
    componentWillUnmount() {
        clearInterval(this.intervalID);
    }
    tick() {
        this.setState({
            time: new Date().toLocaleString()
        });
    }
    render() {
        return (
            <Button icon={<ClockCircleOutlined />}>{this.state.time}</Button>
        );
    }   
}
export default Clock;