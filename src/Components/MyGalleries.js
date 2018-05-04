import React, { Component } from 'react';
import { Image, Card, Header, Divider, Dimmer, Loader, Button, TransitionablePortal, Segment, Comment, Message, Icon } from 'semantic-ui-react';
import '../App.css';

const CommentStyle = {
    textAlign: 'left',
    margin: 'auto',
    width: '80%'
};

const cardsStyle = {
    textAlign: 'left',
    margin: 'auto',
    width: '80%'
};

const loaderStyle = {
    position: 'fixed'
};

const messageStyle = {
    margin: 'auto',
    marginTop: '20px',
    width: 'fit-content',
    boxShadow: '0 0 0 1px rgba(34,36,38,.22) inset, 0 2px 4px 0 rgba(34,36,38,.12), 0 2px 10px 0 rgba(34,36,38,.15)'
};

/**
 * Formats standard UNIX time to human readable string
 * @param {number} unixDate
 * @return {string}
 */
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

class MyGalleries extends Component {

    state = { expand: false };

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            loading: false
        }
    }

    componentDidMount() {
        if (!this.state.items.length) this._getImageTable();
        this.initializeFacebookLogin();
    }

    /**
     * Init FB object and check Facebook Login status
     */
    initializeFacebookLogin = () => {
        this.FB = window.FB;
    };

    /**
     * Gets all image items of current user
     * @private
     */
    _getImageTable() {

        let accessToken = this.props.userToken;
        const endpoint = 'https://aws.sharedcare.io/gallery-api/image-table?tableName=Images';
        const requestUrl = endpoint + '&accessToken=' + accessToken;
        this.setState({
            loading: true
        });
        // Make a reference to this
        let self = this;

        fetch(requestUrl).then(function (response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        }).then( function(resJson) {
            console.log(resJson);
            self.setState({
                items: resJson.Items,
                loading: false
            })
        }).catch(function(err) {
            console.log(err);
            self.setState({
                loading: false
            });
        });
    }

    /**
     * handles the image delete event
     * @param {object} item
     * @private
     */
    _handleImageDelete(item) {

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
                Author: item.Author,
                ImageUrl: item.ImageUrl,
                ImageId: item.ImageId,
                Date: item.Date,
                Description: item.Description,
                Comments: item.comments
            }
        };

        fetch(requestUrl, {
            method: 'DELETE',
            body: JSON.stringify(requestBody)
        }).then( function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            let removed = self.state.items.filter(function(el) {
                return el.ImageId !== item.ImageId;
            });
            self.setState({
                loading: false,
                items: removed
            });
        }).catch( function(err) {
            console.log(err);
            self.setState({
                loading: false
            });
        });
    }

    handleOpen = () => this.setState({ expand: true });

    handleClose = () => this.setState({ expand: false });

    render(){

        const { userId } = this.props;
        const { expand } = this.state;
        const self = this;
        return (
            <div
                className = "MyGalleries">
                <Dimmer
                    active={expand}
                    page
                >
                </Dimmer>
                <Dimmer active={this.state.loading} inverted>
                    <Loader style={loaderStyle} inverted content='Loading' />
                </Dimmer>
                <Header as='h2'>My Galleries</Header>
                <Divider style={{ width: '80%', margin: 'auto' }}/>

                <Card.Group itemsPerRow={4} style={cardsStyle}>
                    {(!this.props.userId) &&
                    <Message icon floating negative style={messageStyle}>
                        <Icon size='big' name='warning' />

                        <Message.Content>
                            <Message.Header>Please log in first</Message.Header>
                        </Message.Content>
                    </Message>}


                    {this.state.items.map( function(item) {
                        return (
                            <Card raised key={item.ImageId}>
                                <Image src={item.ImageUrl} fluid />
                                <Card.Content>
                                    <Card.Header>
                                        {item.Author[1]}
                                    </Card.Header>
                                    <Card.Meta>
                            <span className='date'>
                                {formatDate(item.Date)}
                            </span>
                                    </Card.Meta>
                                    <Card.Description>
                                        {item.Description}
                                    </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    {(item.Author[0] === userId) && <Button size='tiny' icon='trash' basic negative circular onClick={ () => {self._handleImageDelete(item)}} />}
                                    <TransitionablePortal
                                        closeOnTriggerClick
                                        onOpen={self.handleOpen}
                                        onClose={self.handleClose}
                                        openOnTriggerClick
                                        trigger={(
                                            <Button size='tiny' icon='commenting' positive circular floated='right' />
                                        )}
                                    >

                                        <Segment style={{ margin: 'auto', width: '30%', zIndex: 2000, top: '30%', left: '35%', position: 'fixed' }}>
                                            <Comment.Group style={CommentStyle} minimal>
                                                <Header as='h2' dividing>Comments</Header>
                                                {item.Comments && item.Comments.map( function(comment) {
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
                                            </Comment.Group>
                                        </Segment>

                                    </TransitionablePortal>

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