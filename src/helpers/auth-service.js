import axiosInstance from "./axios-service";

const API_URL = "http://127.0.0.1:8000/api/";

class AuthService {
  login(username, password) {
    if (username == "kokkivo" && password == "kokkivo") {
      localStorage.setItem("username", username);
      return true;
    } else {
      return false;
    }
  }
  logout() {
    // eslint-disable-next-line
    localStorage.removeItem("username");
  }

  register(username, email, password) {
    return axiosInstance.post(API_URL + "users/create/", {
      username,
      email,
      password,
    });
  }

  userLoggedIn() {
    return localStorage.getItem("username");
  }
}

export default new AuthService();
