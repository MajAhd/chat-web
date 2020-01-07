import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Components/Home";
// Auth
import Signin from "./Components/Signin";
import Signup from "./Components/Signup";
// Chat
import Chat from "./Components/Chat";
import ErrorPage from "./Components/ErrorPage";
import Aux from "./HOC/Aux";
const Routes = () => {
  return (
    <Aux>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/chat" component={Chat} />
        <Route path="*" component={ErrorPage} />
      </Switch>
    </Aux>
  );
};
export default Routes;
