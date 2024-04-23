import { auth, db } from "../../lib/firebase"
import "./Detail.css"
import { useUserStore } from "../../lib/userStore"
import { useChatStore } from "../../lib/chatStore"
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore"

const Detail = () => {


    const { chatId, user, isCurrentUserBlocked, isRecieverBlocked, changeBlock } = useChatStore();
    const { currentUser } = useUserStore();

    const handelBlock = async () => {
        // console.log("clickwd");
        if(!user) return ;
        
        const userDocRef = doc(db,"users",currentUser.id);
        try{
            
            await updateDoc(userDocRef,{
                blocked: isRecieverBlocked ? arrayRemove(user.id):arrayUnion(user.id),
            });
            
            changeBlock();
        }
        catch(err)
        {
            console.log(err);
        }
    };






    return (
        <div className="detail">
            <div className="user">
                <img src={user?.avatar || "./avatar.png"} alt="" />
                <h2>{user?.username}</h2>
                <p>FlowTalk User</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy & help</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Photos</span>
                        <img src="./arrowDown.png" alt="" />
                    </div>
                    <div className="photos">
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="https://th.bing.com/th/id/OIP.-33GfPL47prhjycT9CsB3gHaE8?rs=1&pid=ImgDetMain" alt="" />
                                <span>Photo_2024_2.png</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="https://th.bing.com/th/id/OIP.-33GfPL47prhjycT9CsB3gHaE8?rs=1&pid=ImgDetMain" alt="" />
                                <span>Photo_2024_2.png</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>
                        
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
            </div>
            <button onClick={handelBlock}>{isCurrentUserBlocked?"You are Blocked":isRecieverBlocked?"User Blocked":"Block"}</button>
            <button className="logout" onClick={() => auth.signOut()}>Logout</button>
        </div>
    )
}
export default Detail