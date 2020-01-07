export default function(state = {}, action) {
  switch (action.type) {
    case "Signin_User":
      return { ...state, auth_signin: action.payload };
    case "Signup_User":
      return { ...state, auth_signup: action.payload };
    case "Logout_User":
      return { ...state, auth_logout: action.payload };
    default:
      return state;
  }
}
