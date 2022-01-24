import * as cartActions from "../actionTypes";
const initialState = {
  cart: [],
};

const cartReducer = (state = initialState, action) => {
  let cart = state.cart;

  switch (action.type) {
    case cartActions.CART_ADD:
      cart.push(action.payload);
      return { ...state.cart, cart: cart };

    case cartActions.CART_REMOVE:
      console.log("Remove");
      return {
        ...state,
        cart: cart.filter(
          (item) => item.product.id != action.payload.productId
        ),
      };

    case cartActions.CART_UPDATE:
      let item = cart.find(
        (item) => item.product.id === action.payload.productId
      );
      let updatedCart = cart.filter(
        (item) => item.product.id != action.payload.productId
      );
      item.quantity = action.payload.quantity;
      updatedCart.push(item);
      return {
        ...state,
        cart: updatedCart,
      };

    case cartActions.QUANTITY_ADD:
      console.log(state);
      let updatecart = state.cart.forEach((element) => {
        if (
          element.product.id == action.payload.id &&
          element.size == action.payload.size
        ) {
          element.quantity = element.quantity + 1;
        }
      });
      return {
        ...state,
        cart: updatecart,
      };

    case cartActions.QUANTITY_SUB:
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id
            ? {
                ...cart,
                quantity: item.quantity !== 1 ? item.quantity - 1 : 1,
              }
            : cart
        ),
      };

    case cartActions.EMPTY_CART:
      return (state = { cart: [] });

    default:
      return state;
  }
};

export default cartReducer;
