import React, { Component } from 'react';
import '../App.css';

class MyGalleries extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imgUrls: ["http://placehold.it/300", "http://placehold.it/300"]
        }
    }

    componentDidMount() {

    }

    render(){
        return (
            <div
                className = "MyGalleries">
                My Galleries
                {this.state.imgUrls.map( function(imageUrl) {
                    return <img src={imageUrl} />
                })}
            </div>
        )
    }
}
export default MyGalleries