import React, { Component } from 'react';
import '../App.css';
import ImageFeed from "./Image";
import { Header } from 'semantic-ui-react'

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imgUrls: ["http://placehold.it/300", "http://placehold.it/300", "http://placehold.it/300", "http://placehold.it/300"]
        }
    }
    
    render(){
        return (
            <div
                className = "HomePage">
                <Header as='h2'>HomePage</Header>

                {this.state.imgUrls.map( function(imageUrl) {
                    return (
                    <ImageFeed imgUrl={imageUrl}/>
                    );
                })}
            </div>
        )
    }
}
export default HomePage