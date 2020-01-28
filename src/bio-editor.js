import React from "react";
import axios from "./axios";

export class BioEditor extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            editingMode: false,
            buttonText: "Edit Bio..."
        };
        this.editBio = this.editBio.bind(this);
        this.toggleBioEditor = this.toggleBioEditor.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount(){
        // console.log("props in bioeditor: ", this.props);
        if (!this.props.bio){
            this.setState({
                buttonText: "Add your bio"
            }, () => console.log("this.state: ", this.state));
        }
    }
    handleChange(inputElement){
        this.setState({
            [inputElement.name]: inputElement.value
        });
        console.log('this.state: ', this.state);

    }

    toggleBioEditor() {
        console.log('bio toggle doing stuff');
        this.setState({
            editingMode: !this.state.editingMode
        });
        // this.props.bioUpdate(this.state.bio);
    }

    editBio() {
        // console.log("this,state.bio: ",this.state.bio);
        axios.post('/bio', {bio: this.state.bio} )
            .then(({ data }) => {
                // console.log('data: ', data);
                this.props.bioUpdate(data.bio);
                this.setState({
                    bio: data.bio
                });
                this.toggleBioEditor();
                // console.log('this.data.bio: ', this.state.bio);
            })
            .catch(err => {
                console.log('error in editbio', err);
            });
    }

    render(){
        let buttonText;
        this.props.bio ? buttonText = "Edit your bio" : buttonText = "Add your bio";
        if (this.state.editingMode){
            return (
                <div>
                    <h1>Tell people something about yourself</h1>
                    <textarea
                        name="bio"
                        onChange={e => this.handleChange(e.target)}
                        defaultValue = {this.props.bio} />
                    <button onClick={() => this.editBio()}>Save Changes</button>
                </div>
            );
        } else {
            return(
                <div>
                    <h2>My Bio:</h2>
                    <h3>
                        {this.props.bio}
                    </h3>
                    <button onClick={this.toggleBioEditor.bind(this)}>
                        {buttonText}
                    </button>
                </div>);
        }
    }

}


//
// function Hello ({initialGreetee}) {
//     const [greetee, setGreetee] = useState (initialGreetee || "World");
//     const [punct, setPunct] = useState ("!!");
//     const change = val => {
//         setGreetee({val:val});
//     };
//     return (
//         <>
//             <p>
//                 Hello, <strong> {greetee} </strong> {punct}
//             </p>
//             <input
//             defaulfValue = {greetee.val}
//             onChange={e => change(e.target.value)}
//             />
//             <input
//             maxLength="2"
//             onChange={e => setPunct(e.taret.value)}
//             />
//         </>
//     );
// };
