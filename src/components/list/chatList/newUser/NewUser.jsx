import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore"
import "./newuser.css"
import React, { useState } from 'react';
import { db } from "../../../../lib/firebase";
import { update } from "firebase/database";
import { useUserStore } from "../../../../lib/userStore";
import { toast } from "react-toastify";

const NewUser = () => {
    const {currentUser} = useUserStore();
    const [user, setUser] = useState(null);
    const handelSearch = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username");
        try {
            const userRef = collection(db, "users");
            const q = query(userRef, where("username", "==", username));
            const querySnapShot = await getDocs(q);
            if (!querySnapShot.empty) {
                toast.success("User Found");
                setUser(querySnapShot.docs[0].data());
            }
            else
            toast.error("User not Found");

        } catch (err) {
            console.log(err);
        }
    };

    const handelAdd = async () => {
        toast.info("adding User");
        const chatRef = collection(db, "chats");
        const userChatRef = collection(db, "userchats");
        try {
            const  newChatRef = doc(chatRef)
            await setDoc(newChatRef,{
                createdAt: serverTimestamp(),
                messages:[]
            });
            

            await updateDoc(doc(userChatRef,user.id),{
                chats:arrayUnion({
                    chatId:newChatRef.id,
                    lastMessage:"",
                    recieverId:currentUser.id,
                    updatedAt: Date.now(),
                })
            });
            await updateDoc(doc(userChatRef,currentUser.id),{
                chats:arrayUnion({
                    chatId:newChatRef.id,
                    lastMessage:"",
                    recieverId:user.id,
                    updatedAt: Date.now(),
                })
            });
            toast.success("User Added Successfully");
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="NewUser" title="">
            <form onSubmit={handelSearch}>
                <input type="text" placeholder="Username" name="username" />
                <button>Search</button>
            </form>
            {user && <div className="user">
                <div className="detail">
                    <img src={user.avatar || "./avatar.png"} alt="" />
                    <span>{user.username}</span>
                </div>
                <button onClick={handelAdd}>Add</button>
            </div>}
        </div>
    )
}
export default NewUser