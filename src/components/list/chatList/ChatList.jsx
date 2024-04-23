import { useEffect, useState } from "react"
import "./chatList.css"
import NewUser from "./newUser/NewUser"
import { useUserStore } from "../../../lib/userStore"
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore"
import { db } from "../../../lib/firebase"
import { useChatStore } from "../../../lib/chatStore"
import Ai from "./ai/Ai"
const ChatList = () => {

  const [addMode, setAddMode] = useState(false)
  const [chats, setChats] = useState([])
  const [input, setInput] = useState("")


  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
      const items = res.data().chats;

      const promises = items.map(async (item) => {
        const userDocRef = doc(db, "users", item.recieverId);
        const userDocSnap = await getDoc(userDocRef);

        const user = userDocSnap.data()
        return { ...item, user }
      });
      const chatData = await Promise.all(promises)

      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt))

    });
    return () => {
      unSub()
    }

  }, [currentUser.id]);
  // console.log(chats)






  const handelSelect = async (chat) => {

    const userChats = chats.map(item => {
      const { user, ...rest } = item;
      return rest;

    })

    const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId)
    userChats[chatIndex].isSeen = true;
    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,

      });
      changeChat(chat.chatId, chat.user);
    }
    catch (err) {
      console.log(err);
    }

  };


  const filterChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );




  return (


    <div className='chatList'>
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder="Search Chats" onChange={(e) => setInput(e.target.value)} />
        </div>
        <img src={addMode ? "./minus.png" : "./plus.png"} alt="" className="add" onClick={() => setAddMode((prev) => !prev)} title="Click to Add Users"/>
      </div>
      <div className="item" id="ai" onClick={() => handelAi()}>
        <img src="./ai.png" alt="" />
        <div className="texts">
          <span>FlowTalk AI</span>
          <p>Hii! How can I help you?</p>
        </div>
      </div>

      {filterChats.map(chat => (
        <div className="item" key={chat.chatId} onClick={() => handelSelect(chat)}
          style={{
            background: chat?.isSeen ? "transparent" : "rgba(255,255,255,0.4)",
          }}>
          <img src={chat.user.blocked.includes(currentUser.id) ? "./avatar1.png" : chat.user.avatar || "./avatar1.png"} alt="" />
          <div className="texts">
            <span>{chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</span>
            <p>{chat.lastmessage}</p>
          </div>
        </div>
      ))}

      <div className="cancel-box" style={addMode?{display:"flex"}:{display:"none"}}><button className="cancel" onClick={() => setAddMode((prev) => !prev)}>X</button></div>
      {addMode && <NewUser />}

    </div>
  )
}

export default ChatList

