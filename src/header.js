import React from 'react';
import { Link } from 'react-router-dom';


export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="header item-a item-d">
                <nav>
                    <ul className="navbar">
                        <li>
                            <Link to="/">Profile</Link>
                        </li>
                        <li>
                            <Link to="/find-people">Find Peeps</Link>
                        </li>
                        <li>
                            <Link to="/friendss">Friends</Link>
                        </li>
                        <li>
                            <Link to="/chat">Chat</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
}
