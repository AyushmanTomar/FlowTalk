import "./ai.css"

const Ai = () => {
    return (

        <div className="chat">
            <div className="app-name-bar">
                <img src="logo.png" alt="" />
                <span>FlowTalk</span>
            </div>
            <div className="top">
                <div className="user">
                    {/* <img src="./ai.png" alt="" /> */}
                    <div className="texts">
                        <span>FlowTalk AI</span>
                        {/* <p>FlowTalk</p> */}
                    </div>
                </div>
                <div className="icon">
                    {/* <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" /> */}
                </div>
            </div>



            <div className="center">
                <div className="message own">
                    <div className="texts">
                        {/* <img src={img.url} alt="" className="sender-pic" /> */}
                    </div>
                </div>

                <div className="message">
                    <div className="texts">
                        {/* {message.img && <img src={message.img} alt="" className="sender-pic" />} */}
                        <p>
                            {/* {message.text} */}
                        </p>
                        {/* <span>{message.createdAt.toDate().toLocaleString()}</span> */}
                    </div>
                </div>
            </div>





            <div className="bottom">
                <div className="icons">
                    <label htmlFor="file">
                        <img src="./img.png" alt="" />
                    </label>

                    <input type="file" id="file" style={{ display: "none" }}  />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <input type="text" placeholder="Enter Message"  />
                <button>Send</button>
            </div>
        </div>
    )
}

export default Ai