import React, { Component } from 'react';
import { Image, Icon, Card } from 'semantic-ui-react';
import '../App.css';

class MyGalleries extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imgUrls: ["http://placehold.it/300", "http://placehold.it/300", "http://placehold.it/300", "http://placehold.it/300"]
        }
    }

    componentDidMount() {

    }

    render(){
        return (
            <div
                className = "MyGalleries">
                My Galleries
                <Card.Group itemsPerRow={4}>

                {this.state.imgUrls.map( function(imageUrl) {
                    return (
                        <Card>
                            <Image src={imageUrl} />
                            <Card.Content>
                                <Card.Header>Title</Card.Header>
                                <Card.Meta>Date</Card.Meta>
                                <Card.Description>Description bla bla bla.</Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <a>
                                    <Icon name='like' />
                                    10 Likes
                                </a>
                            </Card.Content>
                        </Card>
                    );
                })}
                </Card.Group>
            </div>
        )
    }
}
export default MyGalleries