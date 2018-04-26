import React, { Component } from 'react';
import '../App.css';
import HomePage from './HomePage.js';
import MyGalleries from './MyGalleries.js';
import Channels from './Channels.js';
import FacebookLoginButton from './LoginButton';
import { Menu } from 'semantic-ui-react';

const menuStyle = {
    zIndex: '1001'
};

class NavBar extends Component {

    constructor(props){
        super(props);
        this.state = {
            activeComponent: "HomePage"
        }
    }

    _handleItemClick = (e, { name }) => {
        this.props.handler(name);
        this.setState({
            activeComponent: name
        });
    };

    render () {

        return (
            <Menu style={menuStyle} fixed='top' pointing>
                <Menu.Item
                    name='HomePage'
                    active={this.state.activeComponent === 'HomePage'}
                    onClick={this._handleItemClick}
                >
                    Home Page
                </Menu.Item>
                <Menu.Item
                    name='MyGalleries'
                    active={this.state.activeComponent === 'MyGalleries'}
                    onClick={this._handleItemClick}
                >
                    My Galleries
                </Menu.Item>
                <Menu.Item
                    name='Channels'
                    active={this.state.activeComponent === 'Channels'}
                    onClick={this._handleItemClick}
                >
                    Channels
                </Menu.Item>
                <Menu.Menu position='right'>
                    <Menu.Item>
                        <FacebookLoginButton />
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        )
    }
}

export default NavBar