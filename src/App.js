import React, { Component } from "react";
import Routes from "./routes";
import Aux from "./HOC/Aux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
class App extends Component {
  render() {
    return (
      <Aux>
        <Routes />
        <ToastContainer />
      </Aux>
    );
  }
}

export default App;
