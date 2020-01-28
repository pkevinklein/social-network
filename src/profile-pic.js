import React from "react";

export function ProfilePic({firstname, lastname, imgurl, toggle}){
    // console.log("props in ProfilePic: ", firstname + " " + lastname);
    imgurl = imgurl || "/assets/default.png";
    return(
        <div className="item-a col1">
            <div className="">
                <h4>Hello {firstname} {lastname}!</h4>
                <img src={imgurl} alt="logo" width="60px" height="80px" onClick={toggle} />
            </div>
        </div>
    );
}
