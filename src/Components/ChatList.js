import React, { Component } from "react";
import openSocket from "socket.io-client";
import Cookies from "js-cookie";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../Templates/Spinner";
// Redux
import { connect } from "react-redux";
import { GetChatList, GetCurrentUser } from "../Redux/actions";
import { bindActionCreators } from "redux";
import Aux from "../HOC/Aux";
class ChatList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      currentUser: [],
      callback_message: false,
      users: []
    };
  }
  componentDidMount() {
    if (Cookies.get("AuthId") !== undefined) {
      this.load_chatList();
      this.current_user();
      const socket = openSocket("http://localhost:8000");
      socket.on("users", data => {
        if (data.action === "read_user") {
          var joined = this.state.users.concat(data.user);
          this.setState({
            users: joined
          });
          toast.success(`${data.user.name} Joined To Chat!`);
        }
      });
    } else {
      this.props.history.push("/signin");
    }
  }

  load_chatList() {
    this.setState({
      isLoading: true,
      callback_message: false
    });
    this.props
      .GetChatList(Cookies.get("AuthId"))
      .then(() => {
        const httpCallback = this.props.chat.chat_list;
        if ("result" in httpCallback) {
          if (httpCallback["result"] === true) {
            this.setState({
              isLoading: false,
              callback_message: false,
              users: httpCallback["users"]
            });
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
  current_user() {
    this.props
      .GetCurrentUser(Cookies.get("AuthId"))
      .then(() => {
        const httpCallback = this.props.chat.current_user;
        if ("result" in httpCallback) {
          if (httpCallback["result"] === true) {
            if (httpCallback["user"] === null) {
              Cookies.remove("AuthId");
              Cookies.remove("User");
              window.location.reload();
            } else {
              this.setState({
                isLoading: false,
                callback_message: false,
                currentUser: httpCallback["user"]["user_id"]
              });
            }
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
  render() {
    return (
      <Aux>
        <div className="headind_srch">
          <div className="srch_bar">
            <div className="stylish-input-group">
              <h5>Hello {this.state.currentUser.name} !</h5>
              <p>
                @{this.state.currentUser.user_name}{" "}
                <span className="badge badge-success">Online</span>
              </p>
            </div>
          </div>
        </div>
        <div className="inbox_chat">
          {this.state.isLoading ? (
            <Spinner type="text-info" />
          ) : (
            this.state.users.map((user, index) =>
              user._id !== Cookies.get("User") ? (
                <div
                  className="chat_list shadow-sm rounded"
                  key={"user" + index}
                >
                  <NavLink
                    className="nav-link"
                    activeClassName="chat_list_active"
                    to={"/chat/" + this.state.currentUser._id + "/" + user._id}
                  >
                    <div className="chat_people">
                      <div className="chat_img">
                        <img
                          src="https://ptetutorials.com/images/user-profile.png"
                          alt="sunil"
                          className="chat-avatar"
                        ></img>
                      </div>
                      <div className="chat_ib">
                        <h5>
                          {user.name}
                          <span className="chat_date"></span>
                        </h5>
                        <p>{user.user_name}</p>
                      </div>
                    </div>
                  </NavLink>
                </div>
              ) : null
            )
          )}
        </div>
      </Aux>
    );
  }
}
function mapStateToProps(state) {
  return {
    chat: state.chat
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ GetChatList, GetCurrentUser }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatList);
