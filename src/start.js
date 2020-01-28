import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from "./welcome";
import App from "./app";
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducer';
import { Provider } from 'react-redux';
import {init} from "./socket";
import * as io from 'socket.io-client';

const socket = io.connect();

socket.on('welcome', function(data) {
    console.log(data);
    socket.emit('thanks', {
        message: 'Thank you. It is great to be here.'
    });
});

socket.on("someoneNew", console.log);

const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));
// import { HashRouter, Route, Link, Switch } from 'react-router-dom';
// import reduxPromise from 'redux-promise';
// import { reducer } from './reducer';


let element = <Welcome />;
if (location.pathname != "/welcome") {
    init(store);
    element = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(
    element,
    document.querySelector('main')
);

// function App() {
//     return (
//         <div>
//             <HashRouter>
//                 <div>
//                     <Route exact path="/" component={HotOrNot} />
//                 </div>
//             </HashRouter>
//         </div>
//     );
// }
