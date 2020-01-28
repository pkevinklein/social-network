import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { receiveUsers, UnfriendUsers, FriendsWithUsers } from './actions';

export function FriendsOrNot() {
    const dispatch = useDispatch();
    const usersTrue = useSelector(
        state => {

            return state.users && state.users.filter(
                user => user.accepted == true
            );
        }
    );

    const usersFalse = useSelector(
        state => {

            return state.users && state.users.filter(
                user => user.accepted == false
            );
        }
    );

    console.log("userstrue:", usersTrue);
    console.log("usersfalse:", usersFalse);
    useEffect(
        () => {
            dispatch(receiveUsers());
        },
        []);
    return (
        <div id="friendswannabe" >
            <h1>Your friends</h1>
            {usersTrue && usersTrue.map(amigos =>
                <div className="recent peepscard" key={amigos.id}>
                    <Link to={`/user/${amigos.id}`}>
                        <img src={amigos.image_url}/>
                    </Link>
                    <h4>{amigos.first} {amigos.last}</h4>
                    <button onClick={e => {
                        dispatch(UnfriendUsers(amigos.id));

                    }
                    }>Unfriend</button>
                </div>
            )}
            <div id="notfriendswannabe" >
                <h1>Almost friends</h1>
                {usersFalse && usersFalse.map(amigos =>
                    <div className="recent peepscard" key={amigos.id}>
                        <Link to={`/user/${amigos.id}`}>
                            <img src={amigos.image_url}/>
                        </Link>
                        <h4>{amigos.first} {amigos.last}</h4>
                        <button onClick={e => {
                            dispatch(FriendsWithUsers(amigos.id));

                        }
                        }>Accept Friend Request</button>

                    </div>
                )}
            </div></div>
    );
}
