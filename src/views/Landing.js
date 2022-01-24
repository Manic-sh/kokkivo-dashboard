import React from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";

export default class Landing extends React.Component {
  render() {
    return (
      <div className="landing-page">
        <div className="card">
          <div className="container">
            <div className="content">
              <Row>
                <Col span={24}>
                  <div className="photo"></div>
                </Col>
                <Col span={24}>
                  <div className="text">
                    <h1>Welcome to Kokkivo Admin Dashboard .</h1>
                    <p></p>
                    <Link to="/login">Login Here</Link>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
