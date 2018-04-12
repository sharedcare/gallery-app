import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import ResponsiveMenu from 'react-responsive-navbar';
 

class Example extends Component{
    render() {
        return(
            <div className="Nav-boarder">
            <button className="Nav-button">Home</button>
            <button className="Nav-button">Profile</button>
            <button className="Nav-button">Categories</button>
            <button className="Nav-button">Browse</button>
            <button className="Nav-button">Trending</button>
            <button className="Nav-button">Random</button>
            <button className="Nav-button">Help</button>





            </div>


        );
    }
}

  export default Example;

/*
class Navbar extends Component {
    render() {
      return (
        <div className="Navbar">
          
        </div>
      );
    }
  }*/