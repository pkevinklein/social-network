import React from "react";
import axios from "./axios";
import {ProfilePic} from "./profile-pic";
import {FriendshipButton} from "./friendshipbutton";

export class OtherProfile extends React.Component{

    constructor (){
        super();
        this.state = {
            buttonText: ''
        };

    }
    async componentDidMount(){
        try {
            let res = await axios.get(`/friendshipstatus/${this.props.match.params.id}`);
            this.setState({buttonText: res.data.buttonText});
        } catch(e) {
            console.log(e);
        }
        // console.log("this.props.match: ", this.props.match);
        // console.log("this.props.match.params.id: ", this.props.match.params.id);
        axios
            .get(`/api/user/${this.props.match.params.id}`)
            .then(({ data }) => {
                // console.log("data in user/:id get request: ", data);
                if (data.loggedUser == this.props.match.params.id || !data.otherProfile) {
                    this.props.history.push("/");
                } else {
                    this.setState({
                        first: data.otherProfile.first,
                        last: data.otherProfile.last,
                        imageUrl: data.otherProfile.image_url,
                        bio: data.otherProfile.bio
                    });
                }
            });

    }

    dmHandler(data) {
        if(data === 'Unfriend') {
            let newText = '';
            this.setState({buttonText: newText});
        }
    }

    render() {
        let dmButton = null;
        if (this.state.buttonText === "Unfriend"){
            console.log("yes");
            dmButton = <button>Send DM</button>;
        } else dmButton  = null;

        return (
            <div>

                <div className="info">
                    <div className="profile-name">
                        <h1>
                            {this.state.first} {this.state.last}
                        </h1>
                        <img src={this.state.imageUrl} />
                    </div>
                    <p><strong>Bio</strong>:</p><p> {this.state.bio}</p>
                    <a href={"/pchat/" + this.props.match.params.id}>{ dmButton }</a>
                </div>
                <FriendshipButton otherId={this.props.match.params.id}
                    handleDm={this.dmHandler.bind(this)}/>
            </div>
        );
    }
}
