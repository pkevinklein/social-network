import React, {useState, useEffect} from "react";
import axios from "./axios";

export function FriendshipButton ({otherId, handleDm}) {
    console.log("otherId in friendshipbutton: ",otherId);
    const [buttonText, setButtontext] = useState("Wanna be friends?");

    useEffect(()=>{
        console.log("button mounted", otherId);
        axios.get(`/friendshipstatus/${otherId}`)
            .then( res =>{
                console.log("res.data: ", res.data);
                setButtontext(res.data.buttonText);
            })
            .catch(err => console.log("boton amistac: ",err));
    },[]);
    function submit(){
        console.log("clicked on the button", buttonText);
        if (buttonText == "Wanna be friends?"){
            axios.post(`/send-friend-request/${otherId}`)
                .then( res =>{
                    console.log("friendrequest res.data: ", res.data);
                    setButtontext(res.data.buttonText);
                })
                .catch(err => console.log("friendrequest: ",err));
        //we could do the logic here and send 3 different post routes
        //or we can do a post request to 1 route and the route does the logic to determine what time of query to make.
        } else if(buttonText == "Accept friend request"){
            axios.post(`/accept-friend-request/${otherId}`)
                .then( res =>{
                    console.log("friendshipMade res.data: ", res.data);
                    setButtontext(res.data.buttonText);
                })
                .catch(err => console.log("friendshipMade: ",err));
        } else if (buttonText == "Unfriend" || buttonText == "Cancel friend request"){
            handleDm('Unfriend');
            axios.post(`/end-friendship/${otherId}`)
                .then( res =>{
                    console.log("deleteFriendRequest res.data: ", res.data);
                    setButtontext(res.data.buttonText);
                })
                .catch(err => console.log("deleteFriendRequest: ",err));
        }
    }
    return (
        <div>
            <button className="btn" onClick={submit}>{buttonText}</button>
        </div>
    );
}
