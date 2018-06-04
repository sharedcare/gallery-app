import React, { Component } from 'react';
import '../App.css';
import NavBar from './NavBar.js';
import HomePage from './HomePage.js';
import MyGalleries from './MyGalleries.js';
import Channels from './Channels.js';


class MainContainer extends Component {

    constructor(props){
        super(props);
        this.state = {
            activeComponent: "HomePage",
            currentUser: null,
            userAccessToken: null
        };
        this._onNavBarStateChange = this._onNavBarStateChange.bind(this)
    }

    /**
     * Sets current user's id and token
     * @param {array} user
     * @private
     */
    _setCurrentUser(user) {
        this.setState({ currentUser: user[0], userAccessToken: user[1] })
    }

    /**
     * Changes the current active component when click the navbar
     * @param {string} text
     * @private
     */
    _onNavBarStateChange(text){
        this.setState({ activeComponent: text})
    }

    _getActiveComponent(){
        const activeComponent = this.state.activeComponent;
        if (activeComponent === "HomePage"){
            return <HomePage userId={this.state.currentUser} userToken={this.state.userAccessToken}/>
        }
        else if (activeComponent === "MyGalleries"){
            return <MyGalleries userId={this.state.currentUser} userToken={this.state.userAccessToken}/>
        }
        else if(activeComponent === "Channels"){
            return <Channels/>
        }
    }

    render () {

        return (
            <div>
                <NavBar handler={this._onNavBarStateChange} setUser={this._setCurrentUser.bind(this)} />

                {this._getActiveComponent()}
            </div>
            
        )
    }
}

export default MainContainer