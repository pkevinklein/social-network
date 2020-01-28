import React, {useEffect, useRef} from "react";
import {socket} from "./socket";
import {useSelector} from "react-redux";
import { Link } from 'react-router-dom';

export function Chat(){
    const elemRef = useRef();
    const chatMessages = useSelector(
        state => state && state.chatMessages
    );

    useEffect(()=>{
        elemRef.current.scrollTop = elemRef.current.scrollHeight - elemRef.current.clientHeight;
        // console.log("elemRef: ", elemRef.current);
        // console.log("elemRef.current.clientHeight: ", elemRef.current.clientHeight);
        // console.log("elemRef.current.scrollTop: ", elemRef.current.scrollTop);
        // console.log("elemRef: ", elemRef.current);
    }, [chatMessages]);
    //this will be undefined until i have the whole data
    const keyCheck = (e) =>{
        if (e.key == "Enter"){
            console.log("chatMessages: ", chatMessages);
            // console.log("e.key", e.key); // enter
            socket.emit("chatMessage", e.target.value);
            e.target.value = "";
        }
        console.log("e.target.value", e.target.value);
    };
    return(
        <div>
            <h1>chatroom</h1>
            <div className="chat-container" ref={elemRef}>
                {chatMessages && chatMessages.map(chat =>
                    <div key={chat.chat_id}>
                        <Link to={`/user/${chat.id}`}>
                            <img src={chat.image_url} width="50px" height="50px" />
                        </Link>
                        <h4>{chat.first} {chat.last} wrote:</h4>
                        <p>{chat.message}</p>
                        
                    </div>
                )}
                <textarea height="20px" placeholder="Add message here..."
                    onKeyUp= {keyCheck}
                >
                </textarea>
            </div>
        </div>
    );
}
