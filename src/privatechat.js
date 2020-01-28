import React, {useEffect, useRef} from "react";
import {socket} from "./socket";
import {useSelector} from "react-redux";
import { Link } from 'react-router-dom';


export function PrivateChat(props){
    const elemRef = useRef();
    const privateChatMessages = useSelector(
        // state => state && state.privateChatMessages
        state => state.privateChatMessages
    );
    // console.log('out ', props.match.params.id);
    useEffect(()=>{
        // console.log('inner ', props.match.params.id);
        const receiverId = props.match.params.id;
        socket.emit('privateRoom', receiverId);
    },[props]);

    useEffect(()=>{
        elemRef.current.scrollTop = elemRef.current.scrollHeight - elemRef.current.clientHeight;

    }, [privateChatMessages]);
    //this will be undefined until i have the whole data
    const keyCheck = (e) =>{
        if (e.key == "Enter"){
            let payload = {
                receiverId: props.match.params.id,
                msg: e.target.value,
            };
            console.log("privateChatMessages: ", privateChatMessages);
            // console.log("e.key", e.key); // enter
            socket.emit("privateChatMessage", payload);
            e.target.value = "";
        }
    };
    return(
        <div>
            <h1>PRIVATE chatroom</h1>
            <div className="chat-container" ref={elemRef}>
                {privateChatMessages && privateChatMessages.map(chat =>
                    <div key={chat.chat_id}>
                        <Link to={`/user/${chat.id}`}>
                            <img src={chat.image_url} width="50px" height="50px" />
                        </Link>
                        <h4>{chat.first} {chat.last} wrote:</h4>
                        <p>{chat.message}</p><h6>{chat.created_at}</h6>
                    </div>
                )}
            </div>
            <textarea height="70px" placeholder="Add message here..."
                onKeyUp= {keyCheck}
            >
            </textarea>
        </div>
    );
}
