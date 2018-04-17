import React, { Component } from 'react';
import '../App.css';
import NavBar from './NavBar.js';
import HomePage from './HomePage.js';
import MyGalleries from './MyGalleries.js';
import Channels from './Channels.js';
import ImageUpload from './uploadForm';
import FacebookLoginButton from './loginButton';

class MainContainer extends Component {

    onFacebookLogin = (loginStatus, resultObject) => {
        if (loginStatus === true) {
            this.setState({
                username: resultObject.user.name
            });
        } else {
            alert('Facebook login error');
        }
    };

    constructor(props){
        super(props);
        this.state = {
            username: null,
            activeComponent: "HomePage"
        }
        this._onNavBarStateChange = this._onNavBarStateChange.bind(this)
    }

    _onNavBarStateChange(text){
        this.setState({ activeComponent: text})
    }

    _getActiveComponent(){
        const activeComponent = this.state.activeComponent;
        if (activeComponent === "HomePage"){
            return <HomePage/>
        }
        else if (activeComponent === "MyGalleries"){
            return <MyGalleries/>
        }
        else if(activeComponent === "Channels"){
            return <Channels/>
        }
    }

    render () {
        const username  = this.state.username;
        return (
            <div>
                <NavBar handler={this._onNavBarStateChange} />
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
                <ImageUpload />
                {this._getActiveComponent()}
            </div>
            
        )
    }
}

export default MainContainer