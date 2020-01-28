import React from "react";
import {BioEditor} from "./bio-editor";
import Logo from "./logo";

export function Profile(props){
    console.log("props in profile: ", props);
    return (
        <div className="">
            <Logo />

            <BioEditor
                bioUpdate={props.bioUpdate}
                bio={props.bio}
            />
        </div>
    );
}
