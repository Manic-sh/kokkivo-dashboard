import { GET_USERS } from "../actionTypes";

const initialState = {
  users: [],
  loading: true,
};

export default function userReducer(state = initialState, action) {
  switch (action) {
    case GET_USERS:
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    default:
      return state;
  }
}
