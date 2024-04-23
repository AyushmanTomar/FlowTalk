import { ToastContainer } from "react-toastify";
import "./notification.css";
import "react-toastify/dist/ReactToastify.css";
const Notification = () =>{
    return(
        <div className="notification">
            <ToastContainer position="top-center" limit={3}/>
        </div>
    )
}

export default Notification