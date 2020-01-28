import React from "react";
import axios from "./axios";

export default class Logo extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    }
    logout () {
        axios.post("/logout", {
        }).then(
            ({data}) => {
                if (!data.success){
                    location.replace("/");   //do something if the registration is successfull - redirect to the page with the logo
                } else {
                    this.setState({
                        error: false
                    });
                }
            }
        );
    }
    render() {
        return (
            <div>
                <button onClick={e => this.logout(e)}>Log out</button>
            </div>
        );
    }
}
