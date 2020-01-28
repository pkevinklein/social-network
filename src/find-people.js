import React, {useState, useEffect} from "react";
import axios from "./axios";
// import {ProfilePic} from "./profile-pic";
import {Link} from "react-router-dom";

export function FindPeople() {
    const [users, setUsers] = useState([]);
    const [val, setVal] = useState("");
    const [recentPeeps, setRecentPeeps] = useState([]);


    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                const {data} = await axios.get("/users/" + val);
                if(!ignore){
                    if(val ==""){
                        setRecentPeeps(data);
                        setUsers([]);
                    } else{

                        setUsers(data);
                    }
                }
            }
            catch (error){
                console.log("error in findpEOPLE: ", error);
            }
        })();
        return ()=>{
            ignore = true;
            console.log("ignore is true");
        };
    }, [val]);
    return (
        <div>
            <h2>Recent peeps:</h2>
            <div className="recent peepscard">
                {recentPeeps.map(peeps =>
                    <div key={peeps.id}>
                        {peeps.first} {peeps.last}
                        <Link to={`/user/${peeps.id}`}>
                            <img src={peeps.image_url} />
                        </Link>
                        <p>{peeps.bio}</p>
                    </div>
                )}
            </div>
            <h2>Find more people here</h2>
            <input onChange={e => setVal(e.target.value)} defaultValue={val}/>
            {users.map(u =>
                <div className="peepscard recent" key={u.id}>
                    <h3>{u.first} {u.last}</h3>
                    <Link to={`/user/${u.id}`}>
                        <img src={u.image_url} width="200px" className="ProfilePic-medium" />
                    </Link>
                </div>
            )}
        </div>



    // {users &&
    //     users.map(user => {
    //         return (
    //             <div key={user.id}>
    //                 <ProfilePic
    //                     imgurl={user.image_url}
    //                     classPic="avatar"
    //                 />
    //                 {user.first} {user.last}
    //             </div>
    //         );
    //     })}

    );
}
