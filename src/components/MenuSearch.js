import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { retrieveProducts, findProductByTitle } from "../actions/products";

class ProductsList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.setActiveProducts = this.setActiveProducts.bind(this);
    this.findByTitle = this.findByTitle.bind(this);

    this.state = {
      currentProduct: null,
      currentIndex: -1,
      searchTitle: "",
    };
  }

  componentDidMount() {
    this.props.retrieveProducts();
  }

  onChangeSearchTitle(e) {
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle,
    });
  }

  refreshData() {
    this.setState({
      currentProduct: null,
      currentIndex: -1,
    });
  }

  setActiveProducts(product, index) {
    this.setState({
      currentProduct: product,
      currentIndex: index,
    });
  }

  findByTitle() {
    this.refreshData();

    this.props.findProductByTitle(this.state.searchTitle);
  }

  render() {
    const { searchTitle, currentProduct, currentIndex } = this.state;
    const { products } = this.props;

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title"
              value={searchTitle}
              onChange={this.onChangeSearchTitle}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.findByTitle}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Products List</h4>

          <ul className="list-group">
            {products &&
              products.map((product, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveProducts(product, index)}
                  key={index}
                >
                  {product.name}
                </li>
              ))}
          </ul>
        </div>
        <div className="col-md-6">
          {currentProduct ? (
            <div>
              <h4>Products</h4>
              <div>
                <label>
                  <strong>Title:</strong>
                </label>{" "}
                {currentProduct.name}
              </div>
              <div>
                <label>
                  <strong>Description:</strong>
                </label>{" "}
                {currentProduct.category}
              </div>
              <div>
                <label>
                  <strong>Status:</strong>
                </label>{" "}
                {currentProduct.status}
              </div>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Product...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    products: state.products,
  };
};

export default connect(mapStateToProps, {
  retrieveProducts,
  findProductByTitle,
})(ProductsList);
