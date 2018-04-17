import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import ImageUpload from './uploadForm';
import FacebookLoginButton from './loginButton';
import MainContainer from './Components/MainContainer'

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
    };

    render() {
        const { username } = this.state;

        return (
            <div className="App">
                <MainContainer />
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
