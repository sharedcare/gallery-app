import React, { Component } from 'react';
import '../App.css';
import ImageFeed from "./Image";
import { Header, Dimmer, Loader } from 'semantic-ui-react'
import ImageUpload from './UploadForm';

const loaderStyle = {
    position: 'fixed'
};

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            loading: false
        }
    }

    update(){
        this._getImageTable();
    }

    componentDidMount() {
        this.update()
    }

    _getImageTable() {
        const endpoint = 'https://aws.sharedcare.io/gallery-api/image-table?tableName=Images';

        this.setState({
            loading: true
        });
        // Make a reference to this
        let self = this;

        fetch(endpoint).then(function (response) {
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

    render(){

        const { userId } = this.props;
        return (
            <div
                className = "HomePage">
                <Dimmer active={this.state.loading} inverted>
                    <Loader style={loaderStyle} inverted content='Loading' />
                </Dimmer>
                <Header as='h2'>HomePage</Header>

                {this.state.items.reverse().map( function(item) {
                    return (
                    <ImageFeed item={item} key={item.ImageId} userId={userId}/>
                    );
                })}
                <ImageUpload onUploadDone={()=>{this.update()}} />
            </div>
        )
    }
}

export default HomePage