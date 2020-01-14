export default function(state = {}, action) {
  switch (action.type) {
    case "Get_Current_User":
      return { ...state, current_user: action.payload };
    case "Get_Contact_Info":
      return { ...state, contact_info: action.payload };
    case "Get_Chat_List":
      return { ...state, chat_list: action.payload };
    case "Get_Chat":
      return { ...state, chats: action.payload };
    case "Post_New_Message":
      return { ...state, chat_send: action.payload };
    case "Post_New_Media_Message":
      return { ...state, chat_send: action.payload };
    default:
      return state;
  }
}
