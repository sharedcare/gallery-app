import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import ImageUpload from './uploadForm';
import Example from './Navbar';
import FacebookLoginButton from './loginButton';

class App extends Component {

    state = {
        username: null
    };

    onFacebookLogin = (loginStatus, resultObject) => {
        if (loginStatus === true) {
            this.setState({
                username: resultObject.user.name
            });
        } else {
            alert('Facebook login error');
        }
    }

    render() {
        const { username } = this.state;

        return (
            <div className="App">
                <Example />
                <ImageUpload />
                { !username &&
                <div>
                    <p>Click on one of any button below to login</p>
                    <FacebookLoginButton onLogin={this.onFacebookLogin}>
                        <button>Facebook</button>
                    </FacebookLoginButton>
                </div>
                }
                {username &&
                <p>Welcome back, {username}</p>
                }
            </div>
        );
    }
}

export default App;
