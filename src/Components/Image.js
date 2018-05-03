import React, { Component } from 'react';
import { Card, Image, Divider, Comment, Form, Button, Header, TextArea, Transition, Icon } from 'semantic-ui-react';
import '../App.css';

const CommentStyle = {
    textAlign: 'left',
    margin: 'auto',
    width: '80%',
    marginBottom: '30px',
};

const CardStyle = {
    margin: 'auto',
    textAlign: 'left',
    width: '90%',
    marginBottom: '30px',
};

const submitStyle = {
    marginTop: '10px',
    transition: 'all 0.2s ease-out'
};

function formatDate(unixDate) {
    const monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    const dayNames = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let actualDate = new Date(unixDate);
    const day = dayNames[actualDate.getDay()];
    const date = actualDate.getDate();
    const year = actualDate.getFullYear();
    const mouth = monthNames[actualDate.getMonth()];
    const minute = actualDate.getMinutes() < 10 ? '0'+ actualDate.getMinutes() : actualDate.getMinutes();
    const hour = actualDate.getHours();

    return mouth + ' ' +  date + ', ' + year + ' at ' + hour + ':' + minute;
}

class ImageFeed extends Component {

    state = {
        loading: false,
        success: 0,
        active: false
    };

    constructor(props) {
        super(props);
        this.state = {
            Author: props.item.Author,
            ImageUrl: props.item.ImageUrl,
            ImageId: props.item.ImageId,
            Date: props.item.Date,
            Description: props.item.Description,
            Comments: props.item.Comments,
            reply: '',
            userId: 123
        };

        this._handleClick = this._handleClick.bind(this);
    }

    componentDidMount() {
        document.addEventListener('FBObjectReady', this.initializeFacebookLogin);

        this.setState({
            Date: formatDate(this.props.item.Date)
        });
    }

    componentWillUnmount() {
        document.removeEventListener('FBObjectReady', this.initializeFacebookLogin);
    }

    /**
     * Init FB object and check Facebook Login status
     */
    initializeFacebookLogin = () => {
        this.FB = window.FB;
    };

    _handleClick(e) {
        e.preventDefault();

        this.setState({
            loading: true
        });

        this.initializeFacebookLogin();
        if (!this.FB) {
            this.setState({
                loading: false,
                success: -1
            });
            return;
        }

        let accessToken = this.FB.getAccessToken();
        const endpoint = 'https://aws.sharedcare.io/gallery-api/image-table';
        const requestUrl = endpoint + '?accessToken=' + accessToken;
        let Comments = this.state.Comments ? this.state.Comments:[];
        Comments.push({Messages: this.state.reply});
        const requestBody = {
            TableName: 'Images',
            Item: {
                Author: this.state.Author,
                ImageUrl: this.state.ImageUrl,
                ImageId: this.state.ImageId,
                Date: this.props.item.Date,
                Description: this.state.Description,
                Comments: Comments
            }
        };

        // Make a reference to this
        let self = this;

        fetch(requestUrl, {
            method: 'POST',
            body: JSON.stringify(requestBody)
        }).then( function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        }).then( function(resJson) {
            console.log(resJson);
            self.setState({
                Comments: resJson,
                loading: false,
                success: 1
            })
        }).catch( function(err) {
            console.log(err);
            self.setState({
                loading: false,
                success: -1
            });
        });
    }

    _handleCollapseClick = () => this.setState({ active: !this.state.active });

    _handleImageDelete() {

        let accessToken = this.props.userToken;
        const endpoint = 'https://aws.sharedcare.io/gallery-api/image-table';
        const requestUrl = endpoint + '?accessToken=' + accessToken;
        this.setState({
            loading: true
        });
        // Make a reference to this
        let self = this;

        const requestBody = {
            TableName: 'Images',
            Item: {
                Author: this.state.Author,
                ImageUrl: this.state.ImageUrl,
                ImageId: this.state.ImageId,
                Date: this.props.item.Date,
                Description: this.state.Description,
                Comments: this.state.comments
            }
        };

        fetch(requestUrl, {
            method: 'DELETE',
            body: JSON.stringify(requestBody)
        }).then( function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            self.setState({
                loading: false
            });
            window.location.reload();
        }).catch( function(err) {
            console.log(err);
            self.setState({
                loading: false
            });
        });

    }

    render(){

        const { loading, success, active } = this.state;

        return (
            <div className = "image-feed">

                <Divider />
                <Card style={CardStyle} raised>
                    <Image src={this.state.ImageUrl} fluid />
                    <Card.Content>
                        <Card.Header>
                            {this.state.Author[1]}
                        </Card.Header>
                        <Card.Meta>
                            <span className='date'>
                                {this.state.Date}
                            </span>
                        </Card.Meta>
                        <Card.Description>
                            {this.state.Description}
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        {(this.state.Author[0] === this.props.userId) && <Button size='tiny' icon='trash' basic negative circular onClick={() => {this._handleImageDelete()}} />}
                        <Button icon labelPosition='right' toggle floated='right' active={active} onClick={this._handleCollapseClick}>
                            {active ? 'Collapse' : 'Expand' }
                            <Icon name={active ? 'commenting' : 'commenting outline'} />
                        </Button>
                    </Card.Content>
                </Card>
                <Comment.Group style={CommentStyle} minimal collapsed={!active}>
                    <Header as='h3' dividing>Comments</Header>
                    <Transition.Group
                        as={Comment}
                        duration={200}
                        size='huge'
                    >
                        {this.state.Comments && this.state.Comments.map( function(comment) {
                            if (comment.User) {
                                return (
                                    <Comment key={comment.Date}>
                                        <Comment.Avatar as='a'
                                                        src={comment.User ? 'https://graph.facebook.com/' + comment.User[0] + '/picture' : ''}/>
                                        <Comment.Content>
                                            <Comment.Author>{comment.User ? comment.User[1] : ''}</Comment.Author>
                                            <Comment.Metadata style={{marginLeft: 0}}>
                                                <span>{formatDate(comment.Date)}</span>
                                            </Comment.Metadata>
                                            <Comment.Text>
                                                {comment.Messages}
                                            </Comment.Text>
                                            <Comment.Actions>
                                                <Comment.Action><Icon name='delete' /></Comment.Action>
                                            </Comment.Actions>
                                        </Comment.Content>
                                    </Comment>
                                );
                            }
                        })}
                    </Transition.Group>
                    <Form reply>
                        <TextArea onChange={(event, value) => { this.setState({ reply: value.value });}}/>
                        <Button style={submitStyle}
                                positive={success===1}
                                negative={success===-1}
                                loading={loading}
                                content='Add Comment'
                                labelPosition='left'
                                icon='edit'
                                onClick={this._handleClick}
                                primary />
                    </Form>
                </Comment.Group>
            </div>
        )
    }
}

export default ImageFeed