import React, { Component } from "react";
import Layout from "../Layouts/Layout";
import ChatList from "./ChatList";
import Spinner from "../Templates/Spinner";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import openSocket from "socket.io-client";
import moment from "moment";
// Redux
import { connect } from "react-redux";
import { GetChat, PostNewMessage, GetContactInfo } from "../Redux/actions";
import { bindActionCreators } from "redux";
import Aux from "../HOC/Aux";
class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      sendLoading: false,
      validations: false,
      callback_message: false,
      messages: [],
      contact_id: props.match.params.contact_id,
      contactInfo: [],
      user_id: props.match.params.user_id,
      message: ""
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (props.match.params.contact_id !== state.contact_id) {
      return {
        isLoading: false,
        callback_message: false,
        contact_id: props.match.params.contact_id,
        user_id: props.match.params.user_id
      };
    }
    return null;
  }
  componentDidUpdate(nextProps, prevProps) {
    if (prevProps.contact_id !== this.state.contact_id) {
      this.load_chat();
      this.Load_contact_info();
    }
  }
  componentDidMount() {
    if (Cookies.get("AuthId") !== undefined) {
      this.load_chat();
      this.Load_contact_info();
      const socket = openSocket("http://localhost:8000");

      socket.on("messages", data => {
        if (data.action === "read_chat") {
          if (
            data.chat.sender_id === this.state.user_id ||
            data.chat.sender_id === this.state.contact_id ||
            data.chat.contact_id === this.state.user_id ||
            data.chat.contact_id === this.state.contact_id
          ) {
            var joined = this.state.messages.concat(data.chat);
            this.setState({
              messages: joined
            });
            var objDiv = document.getElementById("msg_history");
            objDiv.scrollTop = objDiv.scrollHeight;
          }
        }
      });
    } else {
      this.props.history.push("/signin");
    }
  }
  load_chat() {
    this.setState({
      isLoading: true,
      callback_message: false
    });
    this.props
      .GetChat(this.state.user_id, this.state.contact_id, Cookies.get("AuthId"))
      .then(() => {
        const httpCallback = this.props.chat.chats;
        if ("result" in httpCallback) {
          if (httpCallback["result"] === true) {
            this.setState({
              isLoading: false,
              callback_message: false,
              messages: httpCallback["chats"]
            });
            var objDiv = document.getElementById("msg_history");
            objDiv.scrollTop = objDiv.scrollHeight;
          } else {
            this.setState({
              isLoading: false,
              callback_message: httpCallback["msg"]
            });
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
  send_message() {
    this.setState({
      sendLoading: true,
      validations: false,
      callback_message: false
    });
    this.props
      .PostNewMessage(
        this.state.user_id,
        this.state.contact_id,
        this.state.message,
        Cookies.get("AuthId")
      )
      .then(() => {
        const httpCallback = this.props.chat.chat_send;
        if ("validations" in httpCallback) {
          this.setState({
            sendLoading: false,
            callback_message: false,
            validations: httpCallback.validations
          });
        } else if ("result" in httpCallback) {
          if (httpCallback["result"] === false) {
            this.setState({
              sendLoading: false,
              callback_message: httpCallback["msg"],
              validations: false
            });
          } else {
            // Socket Read Latest Post!
            this.setState({
              sendLoading: false,
              callback_message: false,
              validations: false,
              message: ""
            });
          }
        }
      })
      .catch(err => {
        this.setState({
          sendLoading: false,
          callback_message: "server Error!Try Again...",
          validations: false
        });
      });
  }
  Load_contact_info() {
    this.setState({
      isLoading: true
    });
    this.props
      .GetContactInfo(this.state.contact_id, Cookies.get("AuthId"))
      .then(() => {
        const httpCallback = this.props.chat.contact_info;

        if ("result" in httpCallback) {
          if (httpCallback["result"] === true) {
            this.setState({
              isLoading: false,
              contactInfo: httpCallback["user"]
            });
          } else {
            this.setState({
              isLoading: false
            });
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
  render() {
    return (
      <Layout>
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                {Cookies.get("AuthId") != null ? (
                  <div className="container">
                    <div className="messaging">
                      <div className="inbox_msg">
                        <div className="inbox_people">
                          <ChatList />
                        </div>
                        <div className="mesgs" style={{ height: "70vh" }}>
                          {this.state.isLoading ? (
                            <Spinner type="text-info" />
                          ) : (
                            <div className="msg_history" id="msg_history">
                              {this.state.messages.map((msg, index) =>
                                msg.sender_id === this.state.user_id ? (
                                  <div
                                    className="outgoing_msg"
                                    key={"msg" + index}
                                  >
                                    <div className="sent_msg">
                                      <p className="shadow rounded">
                                        {msg.message}
                                      </p>
                                      <span className="time_date">
                                        {moment(
                                          msg.created_at,
                                          "YYYYMMDD"
                                        ).fromNow()}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className="incoming_msg"
                                    key={"msg" + index}
                                  >
                                    <div className="incoming_msg_img">
                                      <img
                                        src="https://ptetutorials.com/images/user-profile.png"
                                        alt="sunil"
                                        className="chat-avatar"
                                      ></img>
                                    </div>
                                    <div className="received_msg">
                                      <div className="received_withd_msg">
                                        <h6 style={{ color: "#989898" }}>
                                          <Aux>
                                            {this.state.contactInfo.name}
                                            <span>
                                              @
                                              {this.state.contactInfo.user_name}
                                            </span>
                                          </Aux>
                                        </h6>
                                        <p className="shadow rounded">
                                          {msg.message}
                                        </p>
                                        <span className="time_date">
                                          {moment(
                                            msg.created_at,
                                            "YYYYMMDD"
                                          ).fromNow()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                          <div className="type_msg">
                            <div className="input_msg_write">
                              <textarea
                                type="text"
                                className="form-control w-100"
                                placeholder="Type a message"
                                value={this.state.message}
                                onChange={e => {
                                  this.setState({
                                    message: e.target.value
                                  });
                                }}
                              ></textarea>
                              {this.state.sendLoading ? (
                                <Spinner type="text-info" />
                              ) : (
                                <button
                                  className="btn msg_send_btn"
                                  type="button"
                                  onClick={() => {
                                    this.send_message();
                                  }}
                                >
                                  <i
                                    className="fa fa-paper-plane-o"
                                    aria-hidden="true"
                                  ></i>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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

function mapStateToProps(state) {
  return {
    chat: state.chat
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { GetChat, PostNewMessage, GetContactInfo },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
