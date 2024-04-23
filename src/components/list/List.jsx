import "./List.css"
import ChatList from "./chatList/ChatList"
import Userinfo from "./userInfo/Userinfo"
const List=()=>{
    return(
        <div className="list">
            <Userinfo/>
            <ChatList/>
        </div>
    )
}
export default List