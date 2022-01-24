import { FETCH_PRODUCTS, FETCH_ERROR } from "../actionTypes";
import { PRODUCT_ENDPOINT } from "../../helpers/endpoints";
import axios from "axios";

export const fetchProducts = () => async (dispatch) => {
  try {
    const response = await axios.get(PRODUCT_ENDPOINT);
    dispatch({
      type: FETCH_PRODUCTS,
      payload: response.data,
    });
  } catch (e) {
    dispatch({
      type: FETCH_ERROR,
      payload: console.log(e),
    });
  }
};
