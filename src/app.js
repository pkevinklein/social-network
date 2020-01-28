import React from "react";
import axios from "./axios";
import {ProfilePic} from "./profile-pic";
import {FindPeople} from "./find-people";
import Uploader from "./uploader";
import {Profile} from "./profile";
import {OtherProfile} from "./otherprofile";
import { BrowserRouter, Route } from "react-router-dom";
import {FriendsOrNot} from "./friends";
import {Chat} from "./chat";
import {PrivateChat} from "./privatechat";
import { Header } from './header';

export default class App extends React.Component{
    constructor(){
        super();
        this.state = {
            first:"",
            last:"",
            uploaderIsVisible: false,
            imgurl: '',
            id: '',
            bio: ""
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.bioUpdate = this.bioUpdate.bind(this);
    }
    async componentDidMount() {
        // console.log("app has mounted");
        try {
            let { data } = await axios.get('/user.json');
            if (!data) {
                throw 'nope';
            }
            this.setState({
                first: data.first,
                last: data.last,
                imgurl: data.image_url,
                id: data.id,
                bio: data.bio
            }
                // , () =>
                // console.log("this.state in app: ",this.state)
            );
        } catch(err) {
            console.log(err);
        }
    }

    bioUpdate(bio) {

        this.setState({
            bio: bio
        });
    }
    //this is where we want to contact the server and ask from info about the user
    //axios.get()
    //when we get the info back, we want to add it to state
    //this.setState({})

    // In componentDidMount() → Make an axios request to a new route on the server.
    //This route should make a DB query that gets us all the information about the user.
    //When we get that data back we need to set it to state.

    toggleModal (){
        // console.log("toggle modal is running");
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible
        });
    }
    methodInApp(imgurl){
        // console.log("i am a method in App");
        // console.log("imgurl: ", imgurl);
        //here we can change the state of App
        this.setState({
            imgurl: imgurl
        });
        this.toggleModal();
    }

    render(){
        if(!this.state.id){
            return null; //here i could put a spinner
        } else {
            return(
                <div className="">
                    <BrowserRouter>
                        <div className="" role="alert">
                            <div className="header">
                                <ProfilePic
                                    toggle = {this.toggleModal}
                                    firstname = {this.state.first}
                                    lastname = {this.state.last}
                                    imgurl = {this.state.imgurl}
                                />
                                {this.state.uploaderIsVisible &&
                            <Uploader
                                methodInApp = {this.methodInApp.bind(this)}
                                imgurl = {this.state.imgurl}
                            />}
                            </div>
                            <Header>
                            </Header>
                            <Route
                                exact
                                path="/"
                                render={() => (
                                    <Profile
                                        id={this.state.id}
                                        first = {this.state.first}
                                        last = {this.state.last}
                                        imgurl = {this.state.imgurl}
                                        bio={this.state.bio}
                                        bioUpdate={this.bioUpdate}
                                    />
                                )}
                            />
                            <Route path="/user/:id"
                            // component={OtherProfile}
                                render={props => (
                                    <OtherProfile
                                        key={props.match.url}
                                        match={props.match}
                                        history={props.history}
                                    />
                                )}
                            />
                        </div>
                        <Route path="/find-people/" component={FindPeople} />
                        <Route path="/friendss/" component={FriendsOrNot} />
                        <Route exact path="/chat/" component={Chat} />
                        <Route path="/pchat/:id" component={PrivateChat} />
                    </BrowserRouter>
                </div>
            );
        }
    }
}
