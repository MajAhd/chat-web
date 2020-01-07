import axios from "axios";
import { AuthApi } from "../ApiConfig";

export function signinUser(email, password) {
  const request = axios
    .post(AuthApi + "/signin", {
      email: email,
      password: password
    })
    .then(response => response.data);
  return {
    type: "Signin_User",
    payload: request
  };
}
export function signupUser(name, email, password, user_name) {
  const request = axios
    .post(AuthApi + "/signup", {
      name: name,
      email: email,
      password: password,
      user_name: user_name
    })
    .then(response => response.data);
  return {
    type: "Signup_User",
    payload: request
  };
}
export function logoutUser(token, user_id) {
  const request = axios
    .post(AuthApi + "/logout", {
      token: token,
      user_id: user_id
    })
    .then(response => response.data);
  return {
    type: "Logout_User",
    payload: request
  };
}
