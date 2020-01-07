import React, { Component } from "react";
import Layout from "../Layouts/Layout";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import Spinner from "../Templates/Spinner";
// Load Data
import { connect } from "react-redux";
import { signupUser } from "../Redux/actions";
import { bindActionCreators } from "redux";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
      repeat_password: null,
      name: null,
      user_name: null,
      isLoading: false,
      callback_message: false,
      validations: false
    };
  }
  componentDidMount() {
    if (Cookies.get("AuthId") !== undefined) {
      if (window.history.state === null) {
        this.props.history.push("/");
      } else {
        window.history.back();
      }
    }
  }
  register() {
    if (this.state.password !== this.state.repeat_password) {
      this.setState({
        callback_message: "Password not Match!"
      });
    } else {
      this.setState({
        isLoading: true,
        callback_message: false,
        validations: false
      });
      this.props
        .signupUser(
          this.state.name,
          this.state.email,
          this.state.password,
          this.state.user_name
        )
        .then(() => {
          const httpCallback = this.props.signup.auth_signup;
          if ("validations" in httpCallback) {
            this.setState({
              isLoading: false,
              validations: httpCallback.validations
            });
          } else if ("error" in httpCallback) {
            this.setState({
              isLoading: false,
              callback_message: httpCallback.error.message
            });
          } else if ("result" in httpCallback) {
            if (httpCallback["result"] === false) {
              this.setState({
                isLoading: false,
                callback_message: httpCallback["msg"]
              });
            } else {
              let token = httpCallback["token"];
              Cookies.set("AuthId", token.token, { expires: 30 });
              Cookies.set("User", token.user_id, { expires: 30 });

              this.setState({
                isLoading: false,
                callback_message: false,
                validations: false
              });
              this.props.history.push("/");
            }
          }
        })
        .catch(err => {
          this.setState({
            isLoading: false,
            callback_message: "server Error!Try Again...",
            validations: false
          });
        });
    }
  }
  render() {
    return (
      <Layout>
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Register New Account</h5>
                <form>
                  {/*  Full Name */}
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      maxLength="100"
                      className="form-control"
                      onChange={e => {
                        this.setState({
                          name: e.target.value
                        });
                      }}
                    ></input>
                  </div>
                  {/* User-Name */}
                  <div className="form-group">
                    <label>User Name (unique)</label>
                    <input
                      type="text"
                      maxLength="50"
                      className="form-control"
                      onChange={e => {
                        this.setState({
                          user_name: e.target.value
                        });
                      }}
                    ></input>
                  </div>
                  {/* Email Address */}
                  <div className="form-group">
                    <label>Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      onChange={e => {
                        this.setState({
                          email: e.target.value
                        });
                      }}
                    ></input>
                  </div>
                  {/* Password */}
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-control"
                      onChange={e => {
                        this.setState({
                          password: e.target.value
                        });
                      }}
                    ></input>
                  </div>
                  {/* Repeat PAssword */}
                  <div className="form-group">
                    <label>Repeat Password</label>
                    <input
                      type="password"
                      className="form-control"
                      onChange={e => {
                        this.setState({
                          repeat_password: e.target.value
                        });
                      }}
                    ></input>
                  </div>
                  {/* Submit  */}
                  {this.state.callback_message ? (
                    <div className="alert alert-danger">
                      <h5>{this.state.callback_message}</h5>
                    </div>
                  ) : null}
                  {this.state.validations ? (
                    <div className="alert alert-danger" role="alert">
                      <ul>
                        {Object.keys(this.state.validations).map(key => (
                          <li key={"valid" + key}>
                            {this.state.validations[key][0]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {this.state.isLoading ? (
                    <Spinner type="text-info" />
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        this.register();
                      }}
                    >
                      Register
                    </button>
                  )}
                  <Link className="btn btn-link float-right" to="/signin">
                    Already have Account? >Signin
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
function mapStateToProps(state) {
  return {
    signup: state.auths
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ signupUser }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
