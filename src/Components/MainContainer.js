import React, { Component } from 'react';
import '../App.css';
import NavBar from './NavBar.js'
import HomePage from './HomePage.js'
import MyGalleries from './MyGalleries.js'
import Channels from './Channels.js'

class MainContainer extends Component {

    constructor(props){
        super(props);
        this.state = {
            activeComponent: <HomePage/>
        }
        this._onNavBarStateChange = this._onNavBarStateChange.bind(this)
    }

    _onNavBarStateChange(component){
        this.setState({ activeComponent: component})
    }

    render () {
        return (
            <div>
                <NavBar handler={this._onNavBarStateChange} />
                {this.state.activeComponent}
            </div>
            
        )
    }
}

export default MainContainer