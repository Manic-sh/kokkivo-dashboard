import { GET_USERS, USERS_ERROR } from "../actionTypes";
import { USER_ENDPOINT } from "../../helpers/endpoints";
import axios from "axios";

export const getUsers = () => async (dispatch) => {
  try {
    const response = await axios.get(USER_ENDPOINT);
    dispatch({
      type: GET_USERS,
      payload: response.data,
    });
  } catch (e) {
    dispatch({
      type: USERS_ERROR,
      payload: console.log(e),
    });
  }
};
