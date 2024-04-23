import { useState } from "react"
import "./login.css"
import { toast } from "react-toastify"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../../lib/firebase"
import { doc,setDoc } from "firebase/firestore"
import upload from "../../lib/upload"





const Login = () => {
    const [avatar,setAvatar] = useState({
        file:null,
        url:""
    })

    const [loading,setLoading] = useState(false)


const handelAvatar = e =>{
    if(e.target.files[0])
    {
        setAvatar({
            file:e.target.files[0],
            url: URL.createObjectURL(e.target.files[0])
        })
    }
}

    const handleLogin = async(e) =>{
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.target)
        const {email,password} = Object.fromEntries(formData)
        try{
            await signInWithEmailAndPassword(auth,email,password)
            toast.success("Log In Successfull");
            try{
                Window.location.reload();
            }
            catch(errrr){
                console.log(errrr);
            }
        }
        catch(err){
            console.log(err)
            toast.error(err.message)
        }
        finally{
            setLoading(false);
        }
    };


    const handelRegister = async(e) =>{
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.target)
        const {username,email,password} = Object.fromEntries(formData)
        try{
            const res = await createUserWithEmailAndPassword(auth,email,password)
            const imgurl = await upload(avatar.file)
            await setDoc(doc(db,"users",res.user.uid),{
                username,
                email,
                avatar: imgurl,
                id: res.user.uid,
                blocked:[],
            });

            await setDoc(doc(db,"userchats",res.user.uid),{
                chats: [],
            });


            toast.success("Account Created Successfully");
        }
        catch(err)
        {
            console.log(err)
            toast.error(err.message)
        }finally
        {
            setLoading(false)
        }

    }
    handelRegister

    return (
        <div className="Login">
            <div className="item">
                {/* <h2>FlowTalk</h2> */}
                <img src="./logo.png" alt="" />
                <h2>Welcome Back</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="Email" name="email" />
                    <input type="password" placeholder="Password" name="password" />
                    <button disabled={loading}>{loading ?"Loading":"Log In"}</button>
                </form>
            </div>
            <div className="separator"></div>
            <div className="item">
                <h2>Create New Acoount</h2>
                <form onSubmit={handelRegister}>
                    <label htmlFor="file">
                        <img src={avatar.url || "./avatar.png"} alt="" required/>
                        Profile Pic</label>
                    <input type="file" id="file" style={{display:"none"}} onChange={handelAvatar} required/>
                    <input type="text" placeholder="Username" name="username" required/>
                    <input type="text" placeholder="Email" name="email" required />
                    <input type="password" placeholder="Password" name="password" required/>
                    <button disabled={loading}>{loading ?"Loading":"Sign Up"}</button>
                </form>
            </div>
        </div>
    )
}
export default Login