import React, { Component } from 'react';
import '../App.css';
import HomePage from './HomePage.js'
import MyGalleries from './MyGalleries.js'
import Channels from './Channels.js'

class NavBar extends Component {

    constructor(props){
        super(props);
        this.state = {
            activeComponent: "HomePage"
        }
    }

    render () {
        return (
            <div>
                <button className="NavButton" onClick={() => this.props.handler(<HomePage/>)}>Home Page</button>
                <button className="NavButton" onClick={() => this.props.handler(<MyGalleries/>)}>My Galleries</button>
                <button className="NavButton" onClick={() => this.props.handler(<Channels/>)}>Channels</button>
            </div>
        )
    }
}

export default NavBar