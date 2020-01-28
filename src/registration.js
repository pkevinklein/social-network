import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    }
    submit(){
        axios.post("/registration", {
            first: this.state.first,
            last: this.state.last,
            email: this.state.email,
            password: this.state.password
        }).then(
            ({data}) => {
                if (data.success){
                    location.replace("/");   //do something if the registration is successfull - redirect to the page with the logo
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
        return (
            <div>
                {this.state.error && <div className="error">Oops!</div>}
                <input name="first" placeholder="first name" onChange={e => this.handleChange(e.target)} />
                <input name="last" placeholder="last name" onChange={e => this.handleChange(e.target)} />
                <input name="email" placeholder="email" onChange={e => this.handleChange(e.target)} />
                <input name="password" placeholder="password" onChange={e => this.handleChange(e.target)} />
                <button onClick={e => this.submit(e)}>Register</button>
                <Link to="/login">Already have an account? Click me!</Link>
            </div>
        );
    }
}
