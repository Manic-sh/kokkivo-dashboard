import React from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import {
  ORDER_ITEMS_ENDPOINT,
  STOCK_ENDPOINT,
  STOCK_DETAIL_ENDPOINT,
} from "./endpoints";

export async function putData(endpoint, data) {
  await axios
    .put(endpoint, data)
    .then((response) => {
      return response.data;
    })
    .then((responseData) => {
      return <Redirect to="/" />;
    });
}

export async function fetchData(endpoint, thisComp, state, doneLoading) {
  try {
    await axios
      .get(endpoint)
      .then((res) => {
        return res.data;
      })
      .then((response) => {
        thisComp.setState({
          [state]: response,
          doneLoading: doneLoading,
        });
      });
  } catch (error) {
    console.log("error", error);
  }
}

export function postQtyChange(action, id, size, thisComp, quantity = 1) {
  let item;
  let data;

  const endpoint = STOCK_ENDPOINT + `?product=${id}&size=${size}`;

  switch (action) {
    case "ADD":
      axios
        .get(endpoint)
        .then((res) => {
          return res.data;
        })
        .then((resp) => {
          item = resp[0];
          data = {
            id: item.id,
            product: item.product,
            amount: item.amount,
            size: item.size,
            color: item.color,
            quantity: item.quantity - 1,
          };
          const endpointStock = STOCK_DETAIL_ENDPOINT + `${item.id}/`;
          axios.put(endpointStock, data).then((response) => {
            return response.data;
          });
        });
      break;
    case "REMOVE":
      axios
        .get(endpoint)
        .then((res) => {
          return res.data;
        })
        .then((resp) => {
          item = resp[0];
          data = {
            id: item.id,
            product: item.product,
            amount: item.amount,
            size: item.size,
            color: item.color,
            quantity: item.quantity + 1,
          };
          const endpointStock = STOCK_DETAIL_ENDPOINT + `${item.id}/`;
          console.log(endpointStock);
          axios.put(endpointStock, data).then((response) => {
            return response.data;
          });
        });
      break;
    case "DELETE":
      axios
        .get(endpoint)
        .then((res) => {
          return res.data;
        })
        .then((resp) => {
          item = resp[0];
          data = {
            id: item.id,
            product: item.product,
            amount: item.amount,
            size: item.size,
            color: item.color,
            quantity: item.quantity + quantity,
          };
          const endpointStock = STOCK_DETAIL_ENDPOINT + `${item.id}/`;
          axios.put(endpointStock, data).then((response) => {
            return response.data;
          });
        });
      break;
    default:
      thisComp.componentDidMount();
  }
}

export async function addOrEditProduct(
  order_id,
  product_id,
  size,
  color,
  price,
  quantity = 1
) {
  let data = {
    order: order_id,
    product: product_id,
    size: size,
    color: color,
    price: price,
    quantity: quantity,
  };
  console.log(data);
  axios.post(ORDER_ITEMS_ENDPOINT, data).then((response) => {
    return response.data;
  });
}
