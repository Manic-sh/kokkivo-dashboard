import { combineReducers } from "redux";
import userReducer from "./userReducer";
import cartReducer from "./cartReducer";
import productReducer from "./productReducer";

export default combineReducers({
  users: userReducer,
  cart: cartReducer,
  products: productReducer,
});
