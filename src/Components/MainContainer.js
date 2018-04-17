import React, { Component } from 'react';
import '../App.css';
import NavBar from './NavBar.js';
import HomePage from './HomePage.js';
import MyGalleries from './MyGalleries.js';
import Channels from './Channels.js';
import ImageUpload from './uploadForm';


class MainContainer extends Component {

    constructor(props){
        super(props);
        this.state = {
            activeComponent: "HomePage"
        };
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

        return (
            <div>
                <NavBar handler={this._onNavBarStateChange} />
                <ImageUpload />
                {this._getActiveComponent()}
            </div>
            
        )
    }
}

export default MainContainer