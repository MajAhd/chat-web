import axios from "axios";
import { ChatApi } from "../ApiConfig";

export function GetCurrentUser(access_token) {
  const request = axios
    .get(ChatApi + "/currentUser", {
      headers: {
        Authorization: access_token
      }
    })
    .then(response => response.data);
  return {
    type: "Get_Current_User",
    payload: request
  };
}
export function GetChatList(access_token) {
  const request = axios
    .get(ChatApi + "/chatList", {
      headers: {
        Authorization: access_token
      }
    })
    .then(response => response.data);
  return {
    type: "Get_Chat_List",
    payload: request
  };
}
export function GetChat(user_id, contact_id, access_token) {
  const request = axios
    .get(ChatApi + "/loadChat/" + user_id + "/" + contact_id, {
      headers: {
        Authorization: access_token
      }
    })
    .then(response => response.data);
  return {
    type: "Get_Chat",
    payload: request
  };
}
export function GetContactInfo(contact_id, access_token) {
  const request = axios
    .get(ChatApi + "/contactInfo/" + contact_id, {
      headers: {
        Authorization: access_token
      }
    })
    .then(response => response.data);
  return {
    type: "Get_Contact_Info",
    payload: request
  };
}

export function PostNewMessage(user_id, contact_id, message, access_token) {
  const request = axios
    .post(
      ChatApi + "/send",
      {
        sender_id: user_id,
        reciever_id: contact_id,
        message: message
      },
      {
        headers: {
          Authorization: access_token
        }
      }
    )
    .then(response => response.data);
  return {
    type: "Post_New_Message",
    payload: request
  };
}
export function PostNewMediaMessage(
  user_id,
  contact_id,
  message,
  imageFile,
  FileType,
  access_token
) {
  var data = new FormData();
  data.append("media", imageFile, "MessageImage");
  data.append("sender_id", user_id);
  data.append("reciever_id", contact_id);
  data.append("message", message);
  data.append("type", FileType);

  const request = axios
    .post(ChatApi + "/send/media", data, {
      headers: {
        Accept: "application/json",
        Authorization: access_token
      }
    })
    .then(response => response.data);
  return {
    type: "Post_New_Media_Message",
    payload: request
  };
}
