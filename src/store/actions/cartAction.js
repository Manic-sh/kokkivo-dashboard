import {
  CART_ADD,
  CART_REMOVE,
  CART_UPDATE,
  QUANTITY_ADD,
  QUANTITY_SUB,
  EMPTY_CART,
} from "../actionTypes";

export const addToCart = (product, size, color) => {
  return {
    type: CART_ADD,
    payload: {
      product,
      size,
      color,
      quantity: 1,
    },
  };
};

export const removeFromCart = (productId, size) => {
  return {
    type: CART_REMOVE,
    payload: {
      productId: productId,
      size: size,
    },
  };
};

export const updateCart = (productId, quantity) => {
  return {
    type: CART_UPDATE,
    payload: {
      productId: productId,
      quantity: quantity,
    },
  };
};

export const subtractQuantity = (id, size, color) => {
  return {
    type: QUANTITY_SUB,
    payload: { id, size, color },
  };
};
export const addQuantity = (id, size, color) => {
  return {
    type: QUANTITY_ADD,
    payload: { id, size, color },
  };
};
export const emptyCart = () => {
  return {
    type: EMPTY_CART,
  };
};
