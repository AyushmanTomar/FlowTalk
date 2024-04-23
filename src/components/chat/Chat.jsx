
import React, { useEffect, useRef, useState } from "react"
import "./Chat.css"
import EmojiPicker from "emoji-picker-react"
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore"

import { db } from "../../lib/firebase"
import { useChatStore } from "../../lib/chatStore"
import { useUserStore } from "../../lib/userStore"
import upload from "../../lib/upload"
import Ai from "../list/chatList/ai/Ai"


const Chat = () => {
    const [open, setOpen] = useState(false);
    const [chat, setChat] = useState();

    const [text, setText] = useState("");
    const [img, setImg] = useState({
        file: null,
        url: "",
    });



    const { chatId, user, isCurrentUserBlocked, isRecieverBlocked } = useChatStore();
    const { currentUser } = useUserStore();
    const endRef = useRef(null);



    useEffect(() => {
        endRef.current?.scrollIntoView({ behaviour: "smooth" });
    }, []);



    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data())
        })
        return () => {
            unSub();
        }
    }, [chatId])



    const handelEmogi = e => {
        setText((prev) => prev + e.emoji)
        setOpen(false)
    }
    const handelImg = (e) => {
        if (e.target.files[0]) {
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
        //   console.log('enter press here! ')
          handelSend()
        }
      }

      const handelBack =()=>{
        window.open("https://flowtalk-beta.netlify.app/","_self");
      }

    



    const handelSend = async () => {
        if (text === "") return




        let imgUrl = null;
        try {


            if (img.file) {
                imgUrl = await upload(img.file);

            }




            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                    ...(imgUrl && { img: imgUrl }),
                }),
            });

            const userIDs = [currentUser.id, user.id]
            userIDs.forEach(async (id) => {


                const userChatsRef = doc(db, "userchats", id)
                const userChatsSnapshot = await getDoc(userChatsRef);
                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data();



                    const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId);

                    userChatsData.chats[chatIndex].lastmessage = text;
                    userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
                    userChatsData.chats[chatIndex].updatedAt = Date.now();

                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,
                    });
                }
            });


        } catch (err) {
            console.log(err);
        }

        endRef.current?.scrollIntoView({ behaviour: "smooth" });
        setImg({
            file: null,
            url: ""
        });
        setText("");
    };
    const handelDownload = () => {

    };




    endRef.current?.scrollIntoView({ behaviour: "smooth" });
    return (


        <div className="chat" id="chat">
            <div className="app-name-bar">
                <img src="logo.png" alt="" />
                <span>FlowTalk</span>
            </div>
            <div className="top">
                <div className="user">
                    <img src={user?.avatar || "./avatar1.png"} alt="" />
                    <div className="texts">
                        <span>{user?.username}</span>
                        <p>FlowTalk</p>
                    </div>
                </div>
                <div className="icon" id="back" onClick={handelBack}>
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt=""/>
                </div>
            </div>



            <div className="center">

                {chat?.messages?.map((message) => (
                    <div className={message.senderId === currentUser?.id ? "message own" : "message"} key={message?.createAt}>
                        <div className="texts" id="texts">
                        <div className="file-name-div" style={message.img?{display:"flex"}:{display:"none"}} >
                            <a href={message.img} target="_blank">{message.img && <img src={message.img} alt="open in new tab to download file" className="sender-pic" onClick={handelDownload} onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = "./file1.png";
                            }}/>}</a>
                            {message.img?decodeURIComponent(message.img).match(/\)(.*?)\?/)[1]:""}</div>
                            <p>
                                {message.text}
                            </p>
                            <span>{message.createdAt.toDate().toLocaleString()}</span>
                        </div>
                    </div>
                ))}
                {img.url && (
                    <div className="message own">
                        <div className="texts">
                            <a href={img.url} target="_blank"><img src={img.url} alt="file" className="sender-pic" onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = "./file1.png";
                            }}/></a>
                        
                        </div>
                    </div>)}
                <div ref={endRef}></div>
            </div>





            <div className="bottom">
                <div className="icons">
                    <label htmlFor="file">
                        <img src="./img.png" alt="" className="fileuplaod" title="Upload image" />
                    </label>

                    <input type="file" id="file" style={{ display: "none" }} onChange={handelImg} />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <input type="text" placeholder={isCurrentUserBlocked || isRecieverBlocked ? "Cannot type message" : "Enter Message"} onChange={(e) => setText(e.target.value)} value={text} disabled={isCurrentUserBlocked || isRecieverBlocked} onKeyDown={handleKeyPress} />
                <div className="emoji" title="Send Emogi">
                    <img src="./emoji.png" alt="" onClick={() => setOpen((prev) => !prev)} />
                    <div className="picker">
                        <EmojiPicker open={open} onEmojiClick={handelEmogi} />
                    </div>
                </div>
                <button onClick={handelSend} disabled={isCurrentUserBlocked || isRecieverBlocked}>Send</button>
            </div>
        </div>
    )
}
export default Chat