import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount(){
        // console.log("uploader mounted!");
        // console.log("this.props: ", this.props);
        //this.props.methodInApp("i am a muffin rico"); //here we could pass a url of the image that the user wants to upload
        // this.props.methodInApp(this.props.imgurl);
    }

    handleChange(e){
        console.log('fd is: ', e.target.files[0]);
        let fd = new FormData();
        fd.append('file', e.target.files[0]);
        axios
            .post('/upload', fd)
            .then(({ data }) => {
                // console.log('data in uploader: ', data);
                this.setState({
                    imgurl: data.image_url
                });
                this.props.methodInApp(data.image_url);
            })
            .catch(err => {
                console.log('error in uploadpost', err);
            });
    }

    render() {
        return (
            <div>
                <h3>Upload a picture</h3>
                <form className="" action="index.html" method="post">
                    <input onChange={(e) => this.handleChange(e)} type="file" name="file" accept="images/*" />
                </form>
            </div>
        );
    }
}

// <button onClick={() => this.props.methodInApp()} >upload pic</button>
// <input
//     type="file"
//     name="file"
//     accept="image/*"
//     onChange={e => this.upload(e.target)}
// />



//         console.log("upload button pressed", e);
//         let fd = new FormData();
//         console.log(this.state);
//         axios.post("/upload", {
//             image: this.state.image
//         }).then(
//             ({data}) => {
//                 if (data.success){
//                     location.replace("/");   //do something if the registration is successfull - redirect to the page with the logo
//                 } else {
//                     this.setState({
//                         error: true
//                     });
//                 }
//             }
//         ).catch(
//             () => {
//                 this.setState({
//                     error: true
//                 });
//             }
//         );
//     }

//     handleChange(inputElement){
//         this.setState({
//             [inputElement.name]: inputElement.value
//         });
//     }
//     render(){
//         return (
//             <div>
//                 <h2>I am the uploader</h2>

//                 <form className="" action="index.html" method="post">
//                     <input change="handleChange" type="file" name="file" accept="images/*" />
//                     <button onClick={e => this.upload(e)} >upload pic</button>

//                 </form>
//             </div>
//         );
//     }
// }
