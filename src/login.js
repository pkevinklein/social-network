import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    }
    login(){
        axios.post("/login", {
            email: this.state.email,
            password: this.state.password
        }).then(
            ({data}) => {
                console.log(data.success);
                if (data.success){
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            }
        ).catch(
            () => {
                this.setState({
                    error: true
                });
            }
        );
    }
    handleChange(inputElement){
        this.setState({
            //the square braces is to add a dynamic value to the object
            [inputElement.name]: inputElement.value
        });
    }
    render(){
        return(
            <div>
                <h1> Login!</h1>
                {this.state.error && <div className="error">Oops! Wrong info, try again.</div>}
                <input name="email" placeholder="email" onChange={e => this.handleChange(e.target)} />
                <input name="password" placeholder="password" onChange={e => this.handleChange(e.target)} />
                <button onClick={e => this.login(e)}>Login</button>
                <Link to="/">Take me to Registration!</Link>
            </div>
        );
    }
}
