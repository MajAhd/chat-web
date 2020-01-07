import React, { Component } from "react";
import Layout from "../Layouts/Layout";
import openSocket from "socket.io-client";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
class Home extends Component {
  componentDidMount() {
    openSocket("http://localhost:8000");
  }
  render() {
    return (
      <Layout>
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card">
              <div className="card-body">
                {Cookies.get("AuthId") != null ? (
                  <h4>Chat Room</h4>
                ) : (
                  <ul>
                    <li>
                      <Link to="/signin">Sign in </Link>
                    </li>
                    <li>
                      <Link to="/signup">Sign up </Link>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Home;
