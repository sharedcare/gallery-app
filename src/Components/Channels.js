import React, { Component } from 'react';
import { Icon, Input } from 'semantic-ui-react';
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
                <Input
                    icon={<Icon name='search' inverted circular link />}
                    placeholder='Search...'
                />
            </form>
        )
    }
}
export default Channels