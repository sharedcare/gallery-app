import React, { Component } from 'react';
import '../App.css';

class Channels extends Component {
    render(){
        return (
            <div
                className = "Channels"> Channels
                <SearchBar />
            </div>
        )
    }
}

class SearchBar extends Component {
    render(){
        return(
            <form>
                <input
                    type = "text"
                    placeholder = "Search for a channel..."
                />
            </form>
        )
    }
}
export default Channels