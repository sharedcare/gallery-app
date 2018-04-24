import React, { Component } from 'react';
import { Segment, Image, Divider, Comment, Form, Button, Header } from 'semantic-ui-react';
import '../App.css';

const CommentStyle = {
    textAlign: 'left',
    margin: 'auto',
    width: '80%',
    marginBottom: '30px',
};

class ImageFeed extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imgUrl: props.imgUrl,
            comments: [{
                userName: "Joe Henderson",
                date: "Mon Apr 23 2018 12:00:00",
                message: "The hours, minutes and seconds stand as visible reminders that your effort put them all there.\n" +
                "Preserve until your next run, when the watch lets you see how Impermanent your efforts are.",
                userAvatar: "https://react.semantic-ui.com/assets/images/avatar/small/joe.jpg",
            },
            {
                userName: "Christian Rocha",
                date: "Mon Apr 23 2018 13:00:00",
                message: "I re-tweeted this.",
                userAvatar: "https://react.semantic-ui.com/assets/images/avatar/small/christian.jpg",
            }]
        }
    }

    render(){
        return (
            <div className = "image-feed">

                <Divider />
                <Segment padded className="image">

                    <Image src={this.state.imgUrl} fluid />
                </Segment>
                <Comment.Group style={CommentStyle}>
                    <Header as='h3' dividing>Comments</Header>
                    {this.state.comments.map( function(comment) {
                        return (
                            <Comment>
                                <Comment.Avatar as='a' src={comment.userAvatar} />
                                <Comment.Content>
                                    <Comment.Author>{comment.userName}</Comment.Author>
                                    <Comment.Metadata>
                                        <span>{comment.date}</span>
                                    </Comment.Metadata>
                                    <Comment.Text>
                                        {comment.message}
                                    </Comment.Text>
                                    <Comment.Actions>
                                        <Comment.Action>Reply</Comment.Action>
                                    </Comment.Actions>
                                </Comment.Content>
                            </Comment>
                        );
                    })}
                    <Form reply>
                        <Form.TextArea />
                        <Button content='Add Comment' labelPosition='left' icon='edit' primary />
                    </Form>
                </Comment.Group>
            </div>
        )
    }
}
export default ImageFeed