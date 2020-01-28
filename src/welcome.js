import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Registration from './registration';
import Login from './login';


export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                <img src="/assets/logo.jpg" alt="logo"  />
                <h1>Welcome!</h1>
                <HashRouter>
                    <div>
                        <Route exact path = "/" component={Registration} />
                        <Route path = "/login" component={Login} />
                    </div>
                </HashRouter>

            </div>
        );
    }
}
