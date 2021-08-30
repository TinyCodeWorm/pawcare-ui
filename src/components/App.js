import React, {Component} from 'react';

import {TOKEN_KEY} from '../constants/constants';
import Header from './Header';
import Main from './Main';

class App extends Component {
    state = {
        signedIn: localStorage.getItem(TOKEN_KEY) ? true : false
    };

    render() {
        const signedInSuccess = (token) => {
            localStorage.setItem(TOKEN_KEY, token); // improve by add a hash function.
            this.setState({signedIn: true});
        }

        const signedOutSuccess = () => {
            localStorage.removeItem(TOKEN_KEY);
            this.setState({signedIn: false});
        }

        const {signedIn} = this.state;
        return (
            <div className="App">
                <Header signedIn={signedIn} signedOutSuccess={signedOutSuccess}/>
                <Main signedIn={signedIn} signedInSuccess={signedInSuccess}/>
            </div>
        );
    }
}

export default App;
