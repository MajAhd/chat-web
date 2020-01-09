import { combineReducers } from "redux";
import auths from "./auth_reducers";
import chat from "./chat_reducers";
const rootReducers = combineReducers({
  auths,
  chat
});

export default rootReducers;
