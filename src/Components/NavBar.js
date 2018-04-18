import React, { Component } from 'react';
import '../App.css';
import HomePage from './HomePage.js'
import MyGalleries from './MyGalleries.js'
import Channels from './Channels.js'
import FacebookLoginButton from './LoginButton'

class NavBar extends Component {

    constructor(props){
        super(props);
        this.state = {
            activeComponent: "HomePage"
        }
    }

    render () {
        return (
            <div className="nav-bar">
                <button className="mdc-button mdc-button--raised" data-mdc-auto-init="MDCRipple" onClick={() => this.props.handler("HomePage")}>Home Page</button>
                <button className="mdc-button mdc-button--raised" data-mdc-auto-init="MDCRipple" onClick={() => this.props.handler("MyGalleries")}>My Galleries</button>
                <button className="mdc-button mdc-button--raised" onClick={() => this.props.handler("Channels")}>Channels</button>
                <FacebookLoginButton />
            </div>
        )
    }
}

export default NavBar