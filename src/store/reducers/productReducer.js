import { FETCH_PRODUCTS } from "../actionTypes";

const initialState = {
  products: [],
  loading: true,
};

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        loading: false,
      };
    default:
      return state;
  }
}
