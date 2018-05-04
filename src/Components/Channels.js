import React, { Component } from 'react';
import { Icon, Input, Header, Divider } from 'semantic-ui-react';
import '../App.css';

class Channels extends Component {
    render(){
        return (
            <div
                className = "Channels">
                <Header as='h2'>Channels</Header>
                <Divider style={{ width: '60%', margin: 'auto', marginBottom: '20px' }}/>
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